<?php

namespace App\Models\Config;

use App\Middleware\Util\ProviderContainer;
use CanvasApiLibrary\Core\Models\Domain;
use CanvasApiLibrary\Core\Models\Outcome;
use CanvasApiLibrary\Core\Models\OutcomeStub;

class OutcomePlanning
{
    public OutcomeStub $outcome;
    public bool $enabled = false;
    /**
     * Period - level mapping
     * @var array<int, int>
     */
    public array $periodLevels = [];

    /**
     * Summary of toArray
     * @param bool $fullData If true, will fetch and include full outcome data
     * @return array{outcome: array, periodLevels: int[]}
     */
    public function toArray(bool $fullData = true): array
    {
        return [
            'outcome' => self::outcomeToArray($this->outcome, $fullData),
            'enabled' => $this->enabled,
            'periodLevels' => $this->periodLevels
        ];
    }

    public static function fromArray(array $data): self
    {
        $planning = new self();
        $planning->outcome = self::outcomeFromArray($data['outcome']) ?? new OutcomeStub();
        $planning->enabled = $data['enabled'] ?? false;
        $planning->periodLevels = $data['periodLevels'] ?? [];
        return $planning;
    }

    private static function outcomeToArray(OutcomeStub $outcome, bool $fullData = true): array
    {
        $stubData = [
            'id' => $outcome->id,
            'url' => $outcome->url,
            'domain' => $outcome->domain->domain
        ];
        if($fullData){
            $populated = providers()->outcomeProvider->populateOutcome($outcome);
            
            return array_merge($stubData, [
                'title' => $populated->title,
                'description' => $populated->description,
                'points_possible' => $populated->points_possible,
                'mastery_points' => $populated->mastery_points,
                'calculation_method' => $populated->calculation_method,
                'calculation_int' => $populated->calculation_int
            ]);
        }
        return $stubData;
    }

    private static function outcomeFromArray(array $data): OutcomeStub
    {
        $outcome = new OutcomeStub();
        $outcome->id = $data['id'];
        $outcome->url = $data['url'];
        $domain = new Domain($data['domain']);
        $outcome->domain = $domain;
        return $outcome;
    }
}