<?php

namespace App\Controllers;

use App\Models\Config\DecoratedSection;
use CanvasApiLibrary\Core\Models\UserStub;

class StudentController
{
    public function index(){
        $course = course();
        $students = providers()->userProvider->getUsersInCourse($course, "student");
        foreach($students as $student){
            ?>
            <div>
                <a href="/api/students/<?= $student->id; ?>/outcomeresults"><?= htmlspecialchars($student->name); ?></a>
            </div>
            <?php
        }
        return;
    }

    public function outcomeResults($studentId){
        $course = course();
        $studentStub = new UserStub();
        $studentStub->id = $studentId;
        $studentStub->domain = $course->domain;

        $outcomes = providers()->outcomeResultProvider->getOutcomeResultsInCourse($course, [$studentStub]);
        $mapped = array_map(function($outcomeResult) {
            return [
                'id' => $outcomeResult->id,
                'score' => $outcomeResult->score,
                'learning_outcome_id' => $outcomeResult->learning_outcome->id,
                'submitted_or_assessed_at' => $outcomeResult->submitted_or_assessed_at?->format(DATE_ATOM),
            ];
        }, $outcomes);
        return jsonResponse($mapped);
    }
}