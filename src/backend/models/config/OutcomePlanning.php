<?php

namespace App\Models\Config;

use CanvasApiLibrary\Core\Models\Outcome;

class OutcomePlanning
{
    public Outcome $outcome;
    public array $periodLevels = [];
}