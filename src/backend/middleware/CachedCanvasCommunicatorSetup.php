<?php

namespace CanvasApiLibrary\LearningOutcomeReport\Middleware;

use CanvasApiLibrary\LearningOutcomeReport\Middleware\Util\CachedCanvasCommunicator;

/**
 * For development, caches all api calls on the url level.
 */
class CachedCanvasCommunicatorSetup
{
    public function handle($request, $next)
    {
        $apiKey = $request->attributes->get('ApiKey');

        $CanvasCommunicator = new CachedCanvasCommunicator($apiKey);
        $request->attributes->set('CanvasCommunicator', $CanvasCommunicator);
        $response = $next($request);
        return $response;
    }
}