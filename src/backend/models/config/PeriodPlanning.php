<?php

namespace App\Models\Config;

use CanvasApiLibrary\Core\Models\CourseStub;
use CanvasApiLibrary\Core\Models\Domain;
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
            'sections' => array_map(fn($s) => self::sectionToArray($s), $this->sections)
        ];
    }

    public static function fromArray(array $data): self
    {
        $planning = new self();
        $planning->periods = array_map(
            fn($p) => Period::fromArray($p),
            $data['periods']
        );
        $planning->sections = array_map(
            fn($s) => self::sectionFromArray($s),
            $data['sections']
        );
        return $planning;
    }

    private static function sectionToArray(SectionStub $section): array
    {
        $fullSection = providers()->sectionProvider->populateSection($section);
        return [
            "id" => $fullSection->id,
            "course_id" => $fullSection->course->id,
            "domain" => $fullSection->domain->domain,
            "name" => $fullSection->name
        ];
    }

    private static function sectionFromArray(array $data): SectionStub{
        $stub = new SectionStub();
        $stub->id = $data['id'];

        $domain = new Domain($data['domain']);
        $stub->domain = $domain;

        $course = new CourseStub();
        $course->id = $data['course_id'];
        $course->domain = $domain;
        $stub->course = $course;

        return $stub;
    }
}