<?php

namespace App\Models\Config;

class FullConfig
{
    public PlannedOutcomeGroup $rootPlannedOutcomeGroup;
    
    /**
     * List of period plannings
     * @var PeriodPlanning[]
     */
    public array $periodPlannings = [];
}