<?php

namespace App\Models\Config;

use App\Middleware\Util\ProviderContainer;
use CanvasApiLibrary\Core\Models\Outcome;
use CanvasApiLibrary\Core\Models\OutcomeStub;

class OutcomePlanning
{
    public OutcomeStub $outcome;
    /**
     * Period - level mapping
     * @var array<int, int>
     */
    public array $periodLevels = [];

    public function toArray(): array
    {
        return [
            'outcome' => self::outcomeToArray($this->outcome),
            'periodLevels' => $this->periodLevels
        ];
    }

    public static function fromArray(array $data): self
    {
        $planning = new self();
        $planning->outcome = self::outcomeFromArray($data['outcome']);
        $planning->periodLevels = $data['periodLevels'];
        return $planning;
    }

    private static function outcomeToArray(OutcomeStub $outcome): array
    {
        /**
         * @var Outcome $populated
         */
        $populated = providers()->outcomeProvider->populateOutcome($outcome);
        
        return [
            'id' => $populated->id,
            'url' => $populated->url,
            'domain' => $populated->domain,
            'title' => $populated->title,
            'description' => $populated->description,
            'points_possible' => $populated->points_possible,
            'mastery_points' => $populated->mastery_points,
            'calculation_method' => $populated->calculation_method,
            'calculation_int' => $populated->calculation_int
        ];
    }

    private static function outcomeFromArray(array $data): OutcomeStub
    {
        $outcome = new OutcomeStub();
        $outcome->id = $data['id'];
        $outcome->url = $data['url'];
        $outcome->domain = $data['domain'];
        return $outcome;
    }
}