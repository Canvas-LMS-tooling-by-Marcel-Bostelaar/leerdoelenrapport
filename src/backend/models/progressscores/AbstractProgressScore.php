<?php

namespace App\Models\Progressscores;

use App\Models\Config\OutcomePlanning;
use CanvasApiLibrary\Core\Models\Outcome;
use CanvasApiLibrary\Core\Models\OutcomeResult;
use CanvasApiLibrary\Core\Models\OutcomeResultRollup;
use DateTime;
use Exception;

abstract class AbstractProgressScore {
    public readonly int $learning_outcome_id;
    public readonly int $user_id;
    public readonly ?int $outcome_result_id;
    protected int $outcomeWeight;
    public readonly DateTime $lastGradedAt;

    public function __construct(OutcomeResultRollup $result, OutcomePlanning $planning) {
        $this->validatePlanning($planning);

        $this->learning_outcome_id = $planning->outcome->id;
        $this->user_id = $result->user->id;
        $this->outcome_result_id = $result->id;
        $this->outcomeWeight = $planning->weight;
        $this->lastGradedAt = $result->submitted_at;

    }

    private function validatePlanning(OutcomePlanning $planning){
        $highest = 0;
        foreach($planning->periodLevels as $level){
            if($level !== 0){
                if($level < $highest){
                    throw new Exception("Outcome planning has a drop in planned level. Invalid configuration. Cant provide an overal score");
                }
            }
        }
    }
}