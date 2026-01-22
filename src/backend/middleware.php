<?php
use App\Middleware;
use Illuminate\Routing\Router;

$middlewareEveryRequest = [
    Middleware\ReadEnvFile::class,
    // Middleware\CatchUnhandledErrors::class,
    Middleware\StaticApiKeyMiddleware::class,
    Middleware\CachedCanvasCommunicatorSetup::class, 
    Middleware\ProviderSetup::class,
    Middleware\ErrorHandledProviderSetup::class,
    Middleware\CourseContextSetup::class,
];

function registerNamedMiddleware(Router $router){
    $router->aliasMiddleware('ensureCourseContext', Middleware\EnsureCourseContext::class);
}