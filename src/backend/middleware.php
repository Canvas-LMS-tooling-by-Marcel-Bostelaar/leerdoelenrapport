<?php
use App\Middleware;

$middleware = [
    Middleware\ReadEnvFile::class,
    Middleware\StaticApiKeyMiddleware::class,
    Middleware\FilesystemConfigSetup::class,
    Middleware\CachedCanvasCommunicatorSetup::class, 
    Middleware\NonCachingProviderSetup::class,
    Middleware\ErrorHandledProviderSetup::class,
];