<?php

namespace App\Middleware;

use CanvasApiLibrary\Core\Providers;
use App\Middleware\Util\ProviderContainer;
use CanvasApiLibrary\Providers\ApiProviders;
use Illuminate\Container\Container;

class NonCachingProviderSetup
{
    public function handle($request, $next)
    {
        $canvasCommunicator = $request->attributes->get('CanvasCommunicator');
        $clientIDProvider = $request->attributes->get('ClientIDProvider');
        $configProvider = $request->attributes->get('ConfigProvider');
        
        $apiProviders = new ProviderContainer(
        new Providers\AssignmentProvider($canvasCommunicator, $clientIDProvider),
        new Providers\CourseProvider($canvasCommunicator, $clientIDProvider),
        new Providers\GroupProvider($canvasCommunicator, $clientIDProvider),
        new Providers\SectionProvider($canvasCommunicator, $clientIDProvider),
        new Providers\SubmissionProvider($canvasCommunicator, $clientIDProvider),
        new Providers\UserProvider($canvasCommunicator, $clientIDProvider),
        $configProvider
        );

        // Bind to the application container for global helper access
        /** @var Container $app */
        $app = Container::getInstance();
        $app->instance('api.providers', $apiProviders);
        $response = $next($request);
        
        return $response;
    }
}