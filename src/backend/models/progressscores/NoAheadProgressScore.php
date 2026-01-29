<?php

namespace App\Models\Progressscores;

use App\Models\Config\OutcomePlanning;
use CanvasApiLibrary\Core\Models\Outcome;
use CanvasApiLibrary\Core\Models\OutcomeResult;
use Exception;

class NoAheadProgressScore extends AbstractProgressScore {

    public public function __construct(OutcomeResult $result, OutcomePlanning $planning, int $periodNumberForReport) {
        parent::__construct($result, $planning);
    }
}