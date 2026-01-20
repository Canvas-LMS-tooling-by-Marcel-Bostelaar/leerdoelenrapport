<?php

require __DIR__ . '/../../../vendor/autoload.php';

use Illuminate\Container\Container;
use Illuminate\Events\Dispatcher;
use Illuminate\Routing\Router;
use Illuminate\Http\Request;
use CanvasApiLibrary\Middleware;

$container = new Container;
$events = new Dispatcher($container);

$container->bind(
    Illuminate\Routing\Contracts\CallableDispatcher::class,
    Illuminate\Routing\CallableDispatcher::class
);

require __DIR__ . '/../routes.php';

$router = new Router($events, $container);
$router->group([
    'middleware' => [
        Middleware\StaticApiKeyMiddleware::class,
        Middleware\CachedCanvasCommunicatorSetup::class, 
        Middleware\NonCachingProviderSetup::class
    ],
], function () use ($router) {
    routes($router);
});
require __DIR__ . '/../helpers.php';

$request = Request::capture();
$response = $router->dispatch($request);
$response->send();
