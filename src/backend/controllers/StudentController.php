<?php

namespace App\Controllers;

use App\Exceptions\ResultControlFlowEscapehatchException;
use App\Models\Config\DecoratedSection;
use App\Models\Config\GroupingConfig;
use App\Models\Progressscores\RegularOutcomeProgressScore;
use App\Utility\OutcomeUtility;
use CanvasApiLibrary\Core\Models\Outcome;
use CanvasApiLibrary\Core\Models\OutcomeResult;
use CanvasApiLibrary\Core\Models\Section;
use CanvasApiLibrary\Core\Models\User;
use CanvasApiLibrary\Core\Models\UserStub;
use CanvasApiLibrary\Core\Providers\Utility\Lookup;
use CanvasApiLibrary\Core\Providers\Utility\Results\SuccessResult;
use DateTime;
use Illuminate\Http\Request;

class StudentController
{
    public function index(){
        $course = course();
        $students = providers()->userProvider->getUsersInCourse($course, "student");
        return jsonResponse(array_map(function($student) {
            return [
                'id' => $student->id,
                'name' => $student->name
            ];
        }, $students));
    }

    public function outcomeResults($studentId){
        $course = course();
        $studentStub = new UserStub();
        $studentStub->id = $studentId;
        $studentStub->domain = $course->domain;

        $total = providers()->outcomeResultProvider->getOutcomeResultsInCourse($course, [$studentStub]);
        $total = OutcomeUtility::addZeroResultForMissingOutcomes($total, $studentStub, $course, providersRaw()->outcomeGroupProvider, providersRaw()->outcomeProvider, false, false);
        if(!($total instanceof SuccessResult)){
            throw new ResultControlFlowEscapehatchException($total);
        }
        /**
         * @var OutcomeResult[]
         */
        $total = $total->value;
        return jsonResponse([
            "total" => self::createOutcomeResultGroup($total, "Total"),
            "generated" => [],
            "individual_assessments" => []
        ]);
    }

    public function progressScores(Request $request, $studentId){
        $groupingName = $request->input('grouping');
        $aheadBehindPeriodPentalty = floatval($request->input('aheadBehindPeriodPentalty', '0.0'));
        if(!$request->has('period')){
            return jsonResponse(['error' => 'Missing period'], 400);
        }
        $period = intval($request->input('period', '0'));
        if(!$groupingName){
            return jsonResponse(['error' => 'Missing grouping name'], 400);
        }
        $course = course();
        $studentStub = new UserStub();
        $studentStub->id = $studentId;
        $studentStub->domain = $course->domain;

        $fullConfig = providers()->configProvider->getConfigInCourse($course);
        $fullConfig->ensureContent();
        /**
         * @var GroupingConfig
         */
        $groupingConfig = null;
        foreach($fullConfig->groupingConfigs as $gc){
            if($gc->name === $groupingName){
                $groupingConfig = $gc;
                break;
            }
        }
        if(!$groupingConfig){
            return jsonResponse(['error' => 'Grouping config not found'], 404);
        }
        /**
         * @var RegularOutcomeProgressScore[]
         */
        $progressItems = providers()->progressScoreProvider->getProgressScoresForStudent($studentStub, $groupingConfig, $course, $aheadBehindPeriodPentalty, $period);
        $results = array_map(function(RegularOutcomeProgressScore $item) {
            return [
                'outcome_id' => $item->learning_outcome_id,
                'progress_score' => $item->score,
                'weighted_progress_score' => $item->weightedScore,
                'expected_score' => $item->expectedScore,
                'is_above_endlevel' => $item->isAboveEndlevel
            ];
        }, $progressItems);
        return jsonResponse($results);
    }

    /**
     * Summary of createOutcomeResultGroup
     * @param OutcomeResult[] $outcomeResults
     * @param string $description
     * @return array{assessment_description: string, date: mixed, outcome_results: array}
     */
    private static function createOutcomeResultGroup(array $outcomeResults, string $description): array {
        $mapped = [];
        foreach ($outcomeResults as $outcomeResult) {
            $mapped[$outcomeResult->learning_outcome->id] = [
                'score' => $outcomeResult->score,
                'learning_outcome_id' => $outcomeResult->learning_outcome->id,
                'submitted_or_assessed_at' => $outcomeResult->submitted_or_assessed_at?->format(DATE_ATOM),
            ];
        }

        return [
            'assessment_description' => $description,
            'date' => max(array_column($outcomeResults, 'submitted_or_assessed_at'))?->format(DATE_ATOM),
            'outcome_results' => $mapped,
        ];
    }

    public function sections($studentId){
        //TODO replace with direct call, must be implemented in api. This is very inefficient.
        /** @var Section[] $sections*/
        $sections = providers()->sectionProvider->getAllSectionsInCourse(course());
        /**
         * @var Lookup<Section, User>
         */
        $studentsPerSection = providers()->userProvider->getUsersInSections($sections, "Student");
        $validSections = [];
        foreach ($sections as $section) {
            $students = $studentsPerSection->get($section);
            foreach ($students as $student) {
                if ($student->id == $studentId) {
                    $validSections[] = $section;
                    break;
                }
            }
        }
        return jsonResponse(array_map(fn($section) => DecoratedSection::sectionToArray(providersRaw()->sectionProvider, $section, true), $validSections));
    }
}