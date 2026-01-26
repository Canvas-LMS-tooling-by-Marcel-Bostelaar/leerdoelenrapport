<?php

namespace App\Controllers;

use App\Models\Config\DecoratedSection;
use CanvasApiLibrary\Core\Models\Section;

class SectionController
{
    public function index(){
        $course = course();
        $providers = providers();

        /** @var Section[] $sections*/
        $sections = $providers->sectionProvider->getAllSectionsInCourse($course);


        return jsonResponse(array_map(fn($section) => DecoratedSection::sectionToArray($providers->sectionProvider, $section, true), $sections));
    }
}