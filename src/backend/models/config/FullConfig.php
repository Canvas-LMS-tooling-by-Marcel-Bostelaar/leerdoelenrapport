<?php

namespace App\Models\Config;

class FullConfig
{
    public function __construct() {
        $this->rootPlannedOutcomeGroup = new PlannedOutcomeGroup();
    }
    public PlannedOutcomeGroup $rootPlannedOutcomeGroup;
    
    /**
     * List of period plannings
     * @var PeriodPlanning[]
     */
    public array $periodPlannings = [];

    public function toArray(): array
    {
        return [
            'rootPlannedOutcomeGroup' => $this->rootPlannedOutcomeGroup->toArray(),
            'periodPlannings' => array_map(fn($pp) => $pp->toArray(), $this->periodPlannings)
        ];
    }

    public static function fromArray(array $data): self
    {
        $config = new self();
        $config->rootPlannedOutcomeGroup = PlannedOutcomeGroup::fromArray($data['rootPlannedOutcomeGroup']);
        $config->periodPlannings = array_map(
            fn($pp) => PeriodPlanning::fromArray($pp),
            $data['periodPlannings'] ?? []
        );
        return $config;
    }
}