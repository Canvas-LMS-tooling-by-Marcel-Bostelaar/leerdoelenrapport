<?php

use App\Middleware\Util\ProviderContainer;
use CanvasApiLibrary\Core\Models\CourseStub;
use CanvasApiLibrary\Core\Models\Domain;
use Illuminate\Container\Container;
use Illuminate\Routing\ResponseFactory;

if (!function_exists('providersRaw')) {
    /**
     * Retrieve the typed providers container that can return all 4 standard result types.
     */
    function providersRaw(): ProviderContainer
    {
        /** @var Container $app */
        $app = Container::getInstance();
        if (! $app->bound('api.providers.rawresults')) {
            throw new \RuntimeException('Providers container is not bound. Ensure the NonCachingProviderSetup middleware runs before accessing providersRaw().');
        }
        return $app->make('api.providers.rawresults');
    }
}

if (!function_exists('providers')) {
    /**
     * Retrieve the typed providers container that only returns successful results, and throw on errors.
     */
    function providers(): ProviderContainer
    {
        /** @var Container $app */
        $app = Container::getInstance();
        if (! $app->bound('api.providers.cleanresults')) {
            throw new \RuntimeException('Providers container is not bound. Ensure the NonCachingProviderSetup middleware runs before accessing providers().');
        }
        return $app->make('api.providers.cleanresults');
    }
}

if (!function_exists('course')) {
    /**
     * Retrieve the typed providers container.
     */
    function course(): CourseStub | null
    {
        /** @var Container $app */
        $app = Container::getInstance();
        if (! $app->bound('api.coursecontext')) {
            return null;
        }
        $data = $app->make('api.coursecontext');
        $course = new CourseStub();
        $course->id = $data['id'];
        $course->domain = new Domain($data['domain']);
        return $course;
    }
}