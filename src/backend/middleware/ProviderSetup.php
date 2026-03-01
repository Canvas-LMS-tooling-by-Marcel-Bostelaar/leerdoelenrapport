<?php

namespace App\Middleware;

use App\Providers\FilesystemConfigProvider;
use App\Providers\ProgressScoreProvider;
use CanvasApiLibrary\Core\Providers;
use App\Middleware\Util\ProviderContainer;
use Illuminate\Container\Container;

class ProviderSetup
{
    public function handle($request, $next)
    {
        //Retrieve communicator and client ID provider from request attributes
        $canvasCommunicator = $request->attributes->get('CanvasCommunicator');
        $clientIDProvider = $request->attributes->get('ClientIDProvider');

        //Non caching
        $AssignmentProvider = new Providers\AssignmentProvider($canvasCommunicator, $clientIDProvider);
        $CourseProvider = new Providers\CourseProvider($canvasCommunicator, $clientIDProvider);
        $GroupProvider = new Providers\GroupProvider($canvasCommunicator, $clientIDProvider);
        $SectionProvider = new Providers\SectionProvider($canvasCommunicator, $clientIDProvider);
        $SubmissionProvider = new Providers\SubmissionProvider($canvasCommunicator, $clientIDProvider);
        $UserProvider = new Providers\UserProvider($canvasCommunicator, $clientIDProvider);
        $OutcomeGroupProvider = new Providers\OutcomeGroupProvider($canvasCommunicator, $clientIDProvider);
        $OutcomeProvider = new Providers\OutcomeProvider($canvasCommunicator, $clientIDProvider);
        $OutcomeResultProvider = new Providers\OutcomeResultProvider($canvasCommunicator, $clientIDProvider);
        $OutcomeResultRollupProvider = new Providers\OutcomeResultRollupProvider($canvasCommunicator, $clientIDProvider);
        

        //Config provider
        if(!isset($request->attributes->get('envfile')['configfolder'])) {
            throw new \RuntimeException('configfolder environment variable is not set.');
        }
        $configFolder = $request->attributes->get('envfile')['configfolder'];
        $configProvider = new FilesystemConfigProvider(
            $configFolder,
            $SectionProvider,
            $OutcomeProvider,
            $OutcomeGroupProvider
        );

        $ProgressScoreProvider = new ProgressScoreProvider(
            $configProvider,
            $OutcomeResultProvider,
            $OutcomeGroupProvider,
            $OutcomeProvider
        );

        //Container
        $container = new ProviderContainer(
            $AssignmentProvider,
            $CourseProvider,
            $GroupProvider,
            $SectionProvider,
            $SubmissionProvider,
            $UserProvider,
            $OutcomeGroupProvider,
            $OutcomeProvider,
            $OutcomeResultProvider,
            $OutcomeResultRollupProvider,
            $configProvider,
            $ProgressScoreProvider
        );

        // Bind to the application container for global helper access
        /** @var Container $app */
        $app = Container::getInstance();
        $app->instance('api.providers.rawresults', $container);
        $response = $next($request);
        
        return $response;
    }
}