<?php

namespace App\Models\Config;

use CanvasApiLibrary\Core\Models\Outcome;

class OutcomePlanning
{
    public Outcome $outcome;
    public array $periodLevels = [];

    public function toArray(): array
    {
        return [
            'outcome' => $this->outcome->getMinimumDataRepresentation(),
            'periodLevels' => $this->periodLevels
        ];
    }

    public static function fromArray(array $data): self
    {
        $planning = new self();
        $planning->outcome = Outcome::newFromMinimumDataRepresentation($data['outcome'], []);
        $planning->periodLevels = $data['periodLevels'] ?? [];
        return $planning;
    }
}