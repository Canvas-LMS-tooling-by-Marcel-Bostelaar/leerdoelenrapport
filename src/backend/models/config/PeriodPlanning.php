<?php

namespace App\Models\Config;

use CanvasApiLibrary\Core\Models\SectionStub;

class PeriodPlanning
{
    /**
     * Summary of periods
     * @var Period[]
     */
    public array $periods;
    /**
     * Summary of sections
     * @var SectionStub[]
     */
    public array $sections;

    public function toArray(): array
    {
        return [
            'periods' => array_map(fn($p) => $p->toArray(), $this->periods),
            'sections' => array_map(fn($s) => $s->getMinimumDataRepresentation(), $this->sections)
        ];
    }

    public static function fromArray(array $data): self
    {
        $planning = new self();
        $planning->periods = array_map(
            fn($p) => Period::fromArray($p),
            $data['periods'] ?? []
        );
        $planning->sections = array_map(
            fn($s) => SectionStub::newFromMinimumDataRepresentation($s, []),
            $data['sections'] ?? []
        );
        return $planning;
    }
}