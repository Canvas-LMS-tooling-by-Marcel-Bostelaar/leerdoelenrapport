<?php

require __DIR__ . '/../../../vendor/autoload.php';

use Illuminate\Container\Container;
use Illuminate\Events\Dispatcher;
use Illuminate\Routing\Router;
use Illuminate\Http\Request;
use App\Middleware;

if(session_status() == PHP_SESSION_NONE){
    session_start();
}

$container = new Container;
$events = new Dispatcher($container);

$container->bind(
    Illuminate\Routing\Contracts\CallableDispatcher::class,
    Illuminate\Routing\CallableDispatcher::class
);

require __DIR__ . '/../routes.php';
require __DIR__ . '/../middleware.php';

$router = new Router($events, $container);
$router->group([
    'middleware' => $middleware,
], function () use ($router) {
    routes($router);
});
require __DIR__ . '/../helpers.php';

$request = Request::capture();
$container->instance('request', $request);
$container->instance(Request::class, $request);
$response = $router->dispatch($request);
$response->send();
