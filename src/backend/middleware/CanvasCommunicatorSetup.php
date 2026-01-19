<?php

namespace CanvasApiLibrary\LearningOutcomeReport\Middleware;

use CanvasApiLibrary\Core\Services\CanvasCommunicator;

class CanvasCommunicatorSetup
{
    public function handle($request, $next)
    {
        $apiKey = $request->header('ApiKey');

        $CanvasCommunicator = new CanvasCommunicator($apiKey);
        $request->attributes->set('CanvasCommunicator', $CanvasCommunicator);
        $response = $next($request);
        return $response;
    }
}