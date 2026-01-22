<?php

namespace App\Models\Config;

use CanvasApiLibrary\Core\Models\CourseStub;
use CanvasApiLibrary\Core\Models\Domain;
use CanvasApiLibrary\Core\Models\SectionStub;
use CanvasApiLibrary\Core\Providers\Interfaces\OutcomeProviderInterface;
use CanvasApiLibrary\Core\Providers\Interfaces\SectionProviderInterface;
use Section;

class DecoratedSection
{
    public SectionStub $section;
    public bool $isOrphaned = false;

    /**
     * Summary of toArray
     * @param bool $fullData If true, will fetch and include full section data
     * @return array{periods: array, sections: array}
     */
    public function toArray(SectionProviderInterface $sectionProvider, bool $fullData = true): array
    {
        return [
            'section' => DecoratedSection::sectionToArray($sectionProvider, $this->section, $fullData),
            'isOrphaned' => $this->isOrphaned
        ];
    }

    public static function fromArray(array $data): self
    {
        $decoratedSection = new self();
        $decoratedSection->section = self::sectionFromArray($data['section']);
        $decoratedSection->isOrphaned = $data['isOrphaned'] ?? false;
        return $decoratedSection;
    }

    private static function sectionToArray(SectionProviderInterface $sectionProvider, SectionStub $section, bool $fullData = true): array
    {
        $stubData = [
            "id" => $section->id,
            "course_id" => $section->course->id,
            "domain" => $section->domain->domain
        ];
        if(!$fullData){
            return $stubData;
        }
        $fullSection = $sectionProvider->populateSection($section);
        return array_merge($stubData, [
            "name" => $fullSection->name
        ]);
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

    
    /**
     * Marks all sections in config that are missing in data as orphaned.
     * @param SectionStub[] $sections
     * @return void
     */
    public function reconcile(array $sections){
        foreach($sections as $section){
            if($section->id === $this->section->id && $section->domain->domain === $this->section->domain->domain){
                // Found the section, not orphaned
                $this->isOrphaned = false;
                return;
            }
        }
        $this->isOrphaned = true;
    }
}