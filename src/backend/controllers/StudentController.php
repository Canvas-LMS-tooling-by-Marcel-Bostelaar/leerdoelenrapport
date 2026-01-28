<?php

namespace App\Controllers;

use App\Models\Config\DecoratedSection;
use CanvasApiLibrary\Core\Models\Outcome;
use CanvasApiLibrary\Core\Models\OutcomeResult;
use CanvasApiLibrary\Core\Models\UserStub;
use DateTime;

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
        $total = self::addZeroResultForMissingOutcomes($total);
        return jsonResponse([
            "total" => self::createOutcomeResultGroup($total, "Total"),
            "generated" => [],
            "individual_assessments" => []
        ]);
    }

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
        $data = json_decode('[{"id":55355,"course_id":70126,"domain":"https:\/\/flexedu.instructure.com\/","name":"2A - 25\/26"}]');
        return jsonResponse($data);
        //TODO
        // $course = course();
        // $sections = providers()->sectionProvider->getSectionsForStudentInCourse($course, $studentId);
        // return jsonResponse(array_map(fn($section) => DecoratedSection::sectionToArray(providersRaw()->sectionProvider, $section, true), $sections));
    }

    /**
     * Adds an outcome of 0 to all missing outcomes in the result list.
     * @param OutcomeResult[] $results
     * @return OutcomeResult[] Updated outcome result list with a 0 score outcome for all missing outcomes.
     */
    private static function addZeroResultForMissingOutcomes(array $results): array{
        $course = course();
        $outcomeGroups = providers()->outcomeGroupProvider->getOutcomegroupsInCourse($course);
        /**
         * @var Outcome[]
         */
        $outcomes = providers()->outcomeProvider->getOutcomesInOutcomegroups($outcomeGroups)->getAll();
        $mapped = [];
        foreach ($results as $result) {
            $mapped[$result->learning_outcome->id] = $result;
        }
        foreach ($outcomes as $outcome) {
            if (!isset($mapped[$outcome->id])) {
                $item = new OutcomeResult();
                $item->id = -1;
                $item->domain = $course->domain;
                $item->score = 0;
                $item->learning_outcome = $outcome;
                $item->submitted_or_assessed_at = new DateTime("1970-01-01T00:00:00Z");
                $mapped[$outcome->id] = $item;
            }
        }
        return array_values($mapped);
    }
}