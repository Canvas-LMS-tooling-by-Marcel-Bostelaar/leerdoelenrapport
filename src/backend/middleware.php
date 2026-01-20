<?php
use App\Middleware;

$middleware = [
    Middleware\ReadEnvFile::class,
    Middleware\CatchUnhandledErrors::class,
    Middleware\StaticApiKeyMiddleware::class,
    Middleware\FilesystemConfigSetup::class,
    Middleware\CachedCanvasCommunicatorSetup::class, 
    Middleware\NonCachingProviderSetup::class,
    Middleware\ErrorHandledProviderSetup::class,
    Middleware\CourseContextSetup::class,
];