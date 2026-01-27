<?php

namespace App\Models\Config;

use App\Exceptions\ResultControlFlowEscapehatchException;
use CanvasApiLibrary\Core\Models\Domain;
use CanvasApiLibrary\Core\Models\OutcomegroupStub;
use CanvasApiLibrary\Core\Models\OutcomeStub;
use CanvasApiLibrary\Core\Providers\Interfaces\OutcomeProviderInterface;
use CanvasApiLibrary\Core\Providers\Utility\Lookup;
use CanvasApiLibrary\Core\Providers\Utility\Results\SuccessResult;

class OutcomePlanning
{
    public OutcomeStub $outcome;

    /**
     * The status of the outcome.
     * enabled if the outcome is being tracked for this context.
     * disabled if not being tracked.
     * enabled_uncounted if being tracked but not counted in the overall indicators.
     * orphaned if the outcome no longer exists in Canvas, which also disables it.
     * @var string
     */
    public string $status = 'disabled';
    
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
    public function toArray(OutcomeProviderInterface $outcomeProvider, bool $fullData = true): array
    {
        return [
            'outcome' => self::outcomeToArray($this->outcome, $outcomeProvider, $fullData),
            'status' => $this->status,
            'periodLevels' => $this->periodLevels
        ];
    }

    public static function fromArray(array $data): self
    {
        $planning = new self();
        $planning->outcome = self::outcomeFromArray($data['outcome']) ?? new OutcomeStub();
        $planning->status = $data['status'] ?? 'disabled';
        $planning->periodLevels = $data['periodLevels'] ?? [];
        return $planning;
    }

    private static function outcomeToArray(OutcomeStub $outcome, OutcomeProviderInterface $outcomeProvider, bool $fullData = true): array
    {
        $stubData = [
            'id' => $outcome->id,
            'domain' => $outcome->domain->domain
        ];
        if($fullData){
            $populated = $outcomeProvider->populateOutcome($outcome);
            if(!$populated instanceof SuccessResult){
                //error encountered.
                throw new ResultControlFlowEscapehatchException($populated);
            }
            $populated = $populated->value;
            
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
        $domain = new Domain($data['domain']);
        $outcome->domain = $domain;
        return $outcome;
    }

    public function setOrphaned(): void
    {
        $this->status = 'orphaned';
    }

    public function clearOrphaned(): void
    {
        if($this->status === 'orphaned'){
            $this->status = 'disabled';
        }
    }

    public function enable(): void
    {
        $this->status = 'enabled';
    }

    public function disable(): void
    {
        $this->status = 'disabled';
    }
}