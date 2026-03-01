<?php

namespace App\Middleware;

use App\Middleware\Util\Exceptions\NotFoundException;
use App\Middleware\Util\Exceptions\UnauthorizedException;
use App\Middleware\Util\Exceptions\UnknownErrorException;
use App\Providers\Wrappers\ConfigProviderWrapper;
use App\Middleware\Util\ProviderContainer;
use App\Providers\Wrappers\ProgressScoreProviderWrapper;
use CanvasApiLibrary\Core\Providers\Interfaces;
use CanvasApiLibrary\Core\Providers\Utility\Results\ErrorResult;
use CanvasApiLibrary\Core\Providers\Utility\Results\NotFoundResult;
use CanvasApiLibrary\Core\Providers\Utility\Results\SuccessResult;
use CanvasApiLibrary\Core\Providers\Utility\Results\UnauthorizedResult;
use Illuminate\Container\Container;
use Illuminate\Http\Response;

function throwOnError($value){
    if($value instanceof SuccessResult){
        return $value->value;
    }
    if($value instanceof ErrorResult){
        throw new UnknownErrorException(implode(", ", $value->errors));
    }
    if($value instanceof NotFoundResult){
        throw new NotFoundException("Resource not found");
    }
    if($value instanceof UnauthorizedResult){
        throw new UnauthorizedException("Unauthorized access");
    }
    throw new UnknownErrorException("Unknown return type for provider result");
}

class ErrorHandledProviderSetup
{
    public function handle($request, $next)
    {
        if(!isset($request->attributes->get('envfile')['debug'])) {
            throw new \RuntimeException('debug environment variable is not set.');
        }
        $isDebug = $request->attributes->get('envfile')['debug'] == 'true';
        // Bind to the application container for global helper access
        /** @var Container $app */$app = Container::getInstance();
        if (! $app->bound('api.providers.rawresults')) {
            throw new \RuntimeException('raw API providers not set up');
        }
        $providers = $app->make('api.providers.rawresults');

        $capturedFunc = fn($value) => throwOnError($value);

        $cleanProviders = new ProviderContainer(
            new Interfaces\AssignmentProviderWrapper($providers->assignmentProvider, $capturedFunc),
            new Interfaces\CourseProviderWrapper($providers->courseProvider, $capturedFunc),
            new Interfaces\GroupProviderWrapper($providers->groupProvider, $capturedFunc),
            new Interfaces\SectionProviderWrapper($providers->sectionProvider, $capturedFunc),
            new Interfaces\SubmissionProviderWrapper($providers->submissionProvider, $capturedFunc),
            new Interfaces\UserProviderWrapper($providers->userProvider, $capturedFunc),
            new Interfaces\OutcomeGroupProviderWrapper($providers->outcomeGroupProvider, $capturedFunc),
            new Interfaces\OutcomeProviderWrapper($providers->outcomeProvider, $capturedFunc),
            new Interfaces\OutcomeResultProviderWrapper($providers->outcomeResultProvider, $capturedFunc),
            new Interfaces\OutcomeResultRollupProviderWrapper($providers->outcomeResultRollupProvider, $capturedFunc),
            new ConfigProviderWrapper($providers->configProvider, $capturedFunc),
            new ProgressScoreProviderWrapper($providers->progressScoreProvider, $capturedFunc)
        );
        //bind cleaned up providers to clean api providers
        $app->instance('api.providers.cleanresults', $cleanProviders);


        try{
            $response = $next($request);
        } catch (NotFoundException $e){
            return new Response('Resource not found via provider', 404);
        } catch (UnauthorizedException $e){
            return new Response('Unauthorized access via provider', 401);
        } catch (UnknownErrorException $e){
            if($isDebug){
                return new Response('Internal server error in provider: ' . $e->getMessage(), 500);
            }
            else{
                return new Response('Internal server error in provider', 500);
            }
        }
        return $response;
    }
}