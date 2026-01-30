<?php

namespace App\Providers;

use App\Models\Config\GroupingConfig;
use App\Models\Progressscores\RegularOutcomeProgressScore;
use App\Providers\Interfaces\ConfigProviderInterface;
use App\Providers\Interfaces\ProgressScoreProviderInterface;
use App\Providers\Traits\ProgressScoreProviderTrait;
use App\Utility\OutcomeUtility;
use CanvasApiLibrary\Core\Models\CourseStub;
use CanvasApiLibrary\Core\Models\OutcomeResult;
use CanvasApiLibrary\Core\Models\UserStub;
use CanvasApiLibrary\Core\Providers\Interfaces\OutcomegroupProviderInterface;
use CanvasApiLibrary\Core\Providers\Interfaces\OutcomeProviderInterface;
use CanvasApiLibrary\Core\Providers\Interfaces\OutcomeResultProviderInterface;

use CanvasApiLibrary\Core\Providers\Utility\Results\ErrorResult;
use CanvasApiLibrary\Core\Providers\Utility\Results\NotFoundResult;
use CanvasApiLibrary\Core\Providers\Utility\Results\SuccessResult;
use CanvasApiLibrary\Core\Providers\Utility\Results\UnauthorizedResult;


/**
 *  @implements ProgressScoreProviderInterface<SuccessResult<RegularOutcomeProgressScore>,ErrorResult,NotFoundResult,UnauthorizedResult>
 */
class ProgressScoreProvider implements ProgressScoreProviderInterface
{
    use ProgressScoreProviderTrait;

    public function __construct(
        public readonly ConfigProviderInterface $configProvider,
        public readonly OutcomeResultProviderInterface $outcomeResultProvider,
        public readonly OutcomegroupProviderInterface $outcomeGroupProvider,
        public readonly OutcomeProviderInterface $outcomeProvider,
    ) {
    }

    /**
     * Summary of getProgressScoresForStudent
     * @param UserStub $student
     * @param GroupingConfig $config
     * @param CourseStub $course
     * @param float $aheadBehindPeriodPentalty
     * @param int $period
     * @param bool $skipCache
     * @param bool $doNotCache
     * @return SuccessResult<OutcomeResult[]>|ErrorResult|NotFoundResult|UnauthorizedResult
     */
    public function getProgressScoresForStudent(UserStub $student, GroupingConfig $config, CourseStub $course, float $aheadBehindPeriodPentalty, int $period, bool $skipCache = false, bool $doNotCache = false) : mixed{
        $total = $this->outcomeResultProvider->getOutcomeResultsInCourse($course, [$student], $skipCache, $doNotCache);
        $total->flatMapSuccess(function($total) use ($student, $course, $skipCache, $doNotCache) {
            return OutcomeUtility::addZeroResultForMissingOutcomes($total, $student, $course, $this->outcomeGroupProvider, $this->outcomeProvider, $skipCache, $doNotCache);
        });
        if(!$total instanceof SuccessResult){
            return $total;
        }
        /**
         * @var OutcomeResult[]
         */
        $total = $total->value;

        //zip outcomeplanning to outcomeresult
        $planningToResult = [];
        foreach($config->outcomePlannings as $outcomePlanning){
            foreach($total as $outcomeResult){
                if($outcomeResult->learning_outcome->id === $outcomePlanning->outcome->id){
                    $planningToResult[] = [
                        'planning' => $outcomePlanning,
                        'result' => $outcomeResult
                    ];
                    break;
                }
            }
        }
        return new SuccessResult(
            array_map(function($item) use ($aheadBehindPeriodPentalty, $period){
            return new RegularOutcomeProgressScore($item['result'], $item['planning'], $period, $aheadBehindPeriodPentalty);
        }, $planningToResult));
    }
}