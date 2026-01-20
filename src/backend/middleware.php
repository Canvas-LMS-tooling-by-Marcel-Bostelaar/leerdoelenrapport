<?php
use App\Middleware;

$middleware = [
    Middleware\StaticApiKeyMiddleware::class,
    Middleware\FilesystemConfigSetup::class,
    Middleware\CachedCanvasCommunicatorSetup::class, 
    Middleware\NonCachingProviderSetup::class
];