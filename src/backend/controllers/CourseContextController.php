<?php

namespace App\Controllers;

use CanvasApiLibrary\Core\Models\Course;
use CanvasApiLibrary\Core\Models\CourseStub;
use CanvasApiLibrary\Core\Models\Domain;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class CourseContextController
{
    public function index(){
        $currentCourse = course();
        if($currentCourse === null){
            $currentCourse = "No course set in session.";
        }
        else{
            $currentCourse = "Course ID: " . $currentCourse->id . " on Domain: " . $currentCourse->domain->domain;
        }
        return '<p>' . $currentCourse . '</p><form method="post" action="/setCourse">
            Domain: <input type="text" name="domain"><br>
            Course ID: <input type="text" name="courseId"><br>
            <input type="submit" value="Set Course">
        </form>';
    }
    public function store(Request $request)
    {
        $domainInput = $request->input('domain');
        $courseId = $request->input('courseId');

        $domain = new Domain($domainInput);
        $course = new CourseStub();
        $course->id = $courseId;
        $course->domain = $domain;

        if(session_status() == PHP_SESSION_NONE){
            session_start();
        }
        // store in session
        $_SESSION['course'] = [
            'id' => $courseId,
            'domain' => $domainInput
        ];
        
        return new RedirectResponse($request->url());
    }
}