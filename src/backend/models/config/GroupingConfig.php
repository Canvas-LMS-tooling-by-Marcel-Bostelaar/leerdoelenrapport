<?php

namespace App\Models\Config;

use CanvasApiLibrary\Core\Models\OutcomegroupStub;
use CanvasApiLibrary\Core\Models\OutcomeStub;
use CanvasApiLibrary\Core\Models\SectionStub;
use CanvasApiLibrary\Core\Providers\Interfaces\OutcomeProviderInterface;
use CanvasApiLibrary\Core\Providers\Interfaces\SectionProviderInterface;
use CanvasApiLibrary\Core\Providers\Utility\Lookup;

class GroupingConfig
{
    public string $name = 'Unnamed Config';
    /**
     * 
     * @var OutcomePlanning[]
     */
    public array $outcomePlannings = [];
    
    /**
     * List of period plannings
     * @var PeriodPlanning[]
     */
    public array $periodPlannings = [];

    public function toArray(OutcomeProviderInterface $outcomeProvider, SectionProviderInterface $sectionProvider, bool $fullData = true): array
    {
        return [
            'name' => $this->name,
            'outcomePlannings' => array_map(fn($op) => $op->toArray($outcomeProvider, $fullData), $this->outcomePlannings),
            'periodPlannings' => array_map(fn($pp) => $pp->toArray($outcomeProvider, $sectionProvider, $fullData), $this->periodPlannings)
        ];
    }

    public static function fromArray(array $data): self
    {
        $config = new self();
        $config->name = $data['name'] ?? 'Unnamed Config';
        $config->outcomePlannings = array_map(
            fn($op) => OutcomePlanning::fromArray($op),
            $data['outcomePlannings']
        );
        $config->periodPlannings = array_map(
            fn($pp) => PeriodPlanning::fromArray($pp),
            $data['periodPlannings']
        );
        return $config;
    }

    /**
     * Adds outcomes not in config but in given set to the config, flags outcomes in config that are missing in data as orphaned.
     * Marks all sections in config that are missing in data as orphaned.
     * @param OutcomeStub[] $outcomes
     * @param SectionStub[] $sections
     * @return void
     */
    public function reconcile(array $outcomes, array $sections){
        //reconcile sections
        foreach($this->periodPlannings as $periodPlanning){
            $periodPlanning->reconcile($sections);
        }

        //reconcile outcomes.
        //Id indexed lookup of existing outcomes
        $existingOutcomes = [];
        foreach($this->outcomePlannings as $outcomePlanning){
            $existingOutcomes[$outcomePlanning->outcome->id] = $outcomePlanning;
        }
        //id indexed lookup of given outcomes
        $givenOutcomes = [];
        foreach($outcomes as $outcome){
            $givenOutcomes[$outcome->id] = $outcome;
        }
        foreach($givenOutcomes as $givenOutcome){
            if(!isset($existingOutcomes[$givenOutcome->id])){
                // Outcome not in config, add it as disabled
                $newPlanning = new OutcomePlanning();
                $newPlanning->outcome = $givenOutcome;
                $this->outcomePlannings[] = $newPlanning;
            }
            else{
                // Outcome exists in config, ensure not orphaned
                $existingOutcomes[$givenOutcome->id]->clearOrphaned();
            }
        }
        foreach($existingOutcomes as $existingOutcome){
            if(!isset($givenOutcomes[$existingOutcome->outcome->id])){
                // Outcome in config but not in given set, mark as orphaned
                $existingOutcome->setOrphaned();
            }
        }
    }
}