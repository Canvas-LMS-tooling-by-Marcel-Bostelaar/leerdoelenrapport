<?php

namespace App\Middleware;

use CanvasApiLibrary\Core\Services\CanvasCommunicator;
use Illuminate\Container\Container;

class CourseContextSetup
{
    public function handle($request, $next)
    {
        if(session_status() == PHP_SESSION_NONE){
            session_start();
        }
        $course = $_SESSION['course'] ?? null;
        if($course !== null){
            $app = Container::getInstance();
            $app->instance('api.coursecontext', $course);
        }

        $response = $next($request);
        return $response;
    }
}