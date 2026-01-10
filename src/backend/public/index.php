<?php

require __DIR__ . '/../../../vendor/autoload.php';

use Illuminate\Container\Container;
use Illuminate\Events\Dispatcher;
use Illuminate\Routing\Router;
use Illuminate\Http\Request;

$container = new Container;
$events = new Dispatcher($container);

$container->bind(
    Illuminate\Routing\Contracts\CallableDispatcher::class,
    Illuminate\Routing\CallableDispatcher::class
);

$router = new Router($events, $container);

require __DIR__ . '/../middleware.php';
require __DIR__ . '/../routes.php';

$request = Request::capture();
$response = $router->dispatch($request);
$response->send();
