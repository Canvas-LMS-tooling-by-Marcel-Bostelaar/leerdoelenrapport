<?php

namespace App\Models\Config;

class PlannedOutcomeGroup
{
    /**
     * An array of OutcomePlanning and PlannedOutcomeGroup objects.
     * @var (PlannedOutcomeGroup|OutcomePlanning)[]
     */
    public array $outcomesOrGroups = [];
}