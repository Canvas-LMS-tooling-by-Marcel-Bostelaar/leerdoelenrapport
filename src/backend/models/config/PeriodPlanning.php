<?php

namespace App\Models\Config;

use CanvasApiLibrary\Core\Models\CourseStub;
use CanvasApiLibrary\Core\Models\Domain;
use CanvasApiLibrary\Core\Models\SectionStub;
use CanvasApiLibrary\Core\Providers\Interfaces\OutcomeProviderInterface;
use CanvasApiLibrary\Core\Providers\Interfaces\SectionProviderInterface;

class PeriodPlanning
{
    /**
     * Summary of periods
     * @var Period[]
     */
    public array $periods;
    /**
     * Summary of sections
     * @var DecoratedSection[]
     */
    public array $sections;

    /**
     * Summary of toArray
     * @param bool $fullData If true, will fetch and include full section data
     * @return array{periods: array, sections: array}
     */
    public function toArray(OutcomeProviderInterface $outcomeProvider, SectionProviderInterface $sectionProvider, bool $fullData = true): array
    {
        return [
            'periods' => array_map(fn($p) => $p->toArray($outcomeProvider, $fullData), $this->periods),
            'sections' => array_map(fn($s) => $s->toArray($sectionProvider, $fullData), $this->sections)
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
            fn($s) => DecoratedSection::fromArray($s),
            $data['sections'] ?? []
        );
        return $planning;
    }

    
    /**
     * Marks all sections in config that are missing in data as orphaned.
     * @param SectionStub[] $sections
     * @return void
     */
    public function reconcile(array $sections){
        foreach($this->sections as $decoratedSection){
            $decoratedSection->reconcile($sections);
        }
    }
}