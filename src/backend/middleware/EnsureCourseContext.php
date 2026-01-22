<?php

namespace App\Middleware;

use CanvasApiLibrary\Core\Services\CanvasCommunicator;
use Illuminate\Container\Container;
use Illuminate\Http\Response;

class EnsureCourseContext
{
    public function handle($request, $next)
    {
        $course = course();
        if($course === null){
            return new Response("could not retrieve the course context, which is needed for this endpoint", 400);
        }

        $response = $next($request);
        return $response;
    }
}