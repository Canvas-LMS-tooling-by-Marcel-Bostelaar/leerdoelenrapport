<?php

use CanvasApiLibrary\LearningOutcomeReport\Middleware\Util\ProviderContainer;
use Illuminate\Container\Container;

if (!function_exists('providers')) {
    /**
     * Retrieve the typed providers container.
     */
    function providers(): ProviderContainer
    {
        /** @var Container $app */
        $app = Container::getInstance();
        if (! $app->bound('api.providers')) {
            throw new \RuntimeException('Providers container is not bound. Ensure the NonCachingProviderSetup middleware runs before accessing providers().');
        }
        return $app->make('api.providers');
    }
}
