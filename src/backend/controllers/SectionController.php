<?php

namespace App\Controllers;

use App\Models\Config\DecoratedSection;
use CanvasApiLibrary\Core\Models\Section;
use CanvasApiLibrary\Core\Models\SectionStub;

class SectionController
{
    public function index(){
        $course = course();

        /** @var Section[] $sections*/
        $sections = providers()->sectionProvider->getAllSectionsInCourse($course);


        return jsonResponse(array_map(fn($section) => DecoratedSection::sectionToArray(providersRaw()->sectionProvider, $section, true), $sections));
    }

    public function students($sectionId){
        $sectionStub = new SectionStub();
        $sectionStub->id = $sectionId;
        $sectionStub->domain = course()->domain;
        $sectionStub->course = course();


        $students = providers()->userProvider->getUsersInSection($sectionStub, "Student");
        return jsonResponse(array_map(function($student) {
            return [
                'id' => $student->id,
                'name' => $student->name
            ];
        }, $students));
    }
}