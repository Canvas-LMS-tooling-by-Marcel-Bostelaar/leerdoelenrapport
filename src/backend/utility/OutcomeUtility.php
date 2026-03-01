<?php

namespace App\Utility;

use CanvasApiLibrary\Core\Models\CourseStub;
use CanvasApiLibrary\Core\Models\OutcomeResultRollup;
use CanvasApiLibrary\Core\Models\UserStub;
use CanvasApiLibrary\Core\Models\Outcome;
use CanvasApiLibrary\Core\Providers\Interfaces\OutcomegroupProviderInterface;
use CanvasApiLibrary\Core\Providers\Interfaces\OutcomeProviderInterface;
use CanvasApiLibrary\Core\Providers\Utility\Results\ErrorResult;
use CanvasApiLibrary\Core\Providers\Utility\Results\SuccessResult;
use CanvasApiLibrary\Core\Providers\Utility\Results\NotFoundResult;
use CanvasApiLibrary\Core\Providers\Utility\Results\UnauthorizedResult;
use DateTime;

class OutcomeUtility{
    /**
     * Adds an outcome of 0 to all missing outcomes in the result list.
     * @param OutcomeResultRollup[] $results
     * @return ErrorResult|SuccessResult<OutcomeResultRollup[]>|NotFoundResult|UnauthorizedResult Updated outcome result list with a 0 score outcome for all missing outcomes.
     */
    public static function addZeroResultForMissingRollups(array $results, UserStub $user, CourseStub $course, OutcomegroupProviderInterface $outcomeGroupProvider, OutcomeProviderInterface $outcomeProvider, bool $skipCache, bool $doNotCache): mixed{
        $outcomeGroups = $outcomeGroupProvider->getOutcomegroupsInCourse($course, $skipCache, $doNotCache);
        if(!$outcomeGroups instanceof SuccessResult){
            return $outcomeGroups;
        }
        $outcomeGroups = $outcomeGroups->value;
        $outcomes = $outcomeProvider->getOutcomesInOutcomegroups($outcomeGroups, $skipCache, $doNotCache)->mapSuccess(fn($x) => $x->getAll());
        if(!$outcomes instanceof SuccessResult){
            return $outcomes;
        }
        $outcomes = $outcomes->value;

        $mapped = [];
        foreach ($results as $result) {
            $mapped[$result->learning_outcome->id] = $result;
        }
        foreach ($outcomes as $outcome) {
            if (!isset($mapped[$outcome->id])) {
                $item = new OutcomeResultRollup();
                $item->id = -1;
                $item->domain = $course->domain;
                $item->score = 0;
                $item->learning_outcome = $outcome;
                $item->submitted_at = new DateTime("1970-01-01T00:00:00Z");
                $item->user = $user;
                $mapped[$outcome->id] = $item;
            }
        }
        // @phpstan-ignore-next-line
        return new SuccessResult(array_values($mapped));
    }
}