<?php

use App\Middleware\Util\ProviderContainer;
use CanvasApiLibrary\Core\Models\CourseStub;
use Illuminate\Container\Container;
use Illuminate\Routing\ResponseFactory;

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

if (!function_exists('course')) {
    /**
     * Retrieve the typed providers container.
     */
    function course(): CourseStub
    {
        /** @var Container $app */
        $app = Container::getInstance();
        if (! $app->bound('api.course')) {
            throw new \RuntimeException('Course container is not bound. Ensure the NonCachingProviderSetup middleware runs before accessing course().');
        }
        return $app->make('api.course');
    }
}


if (! function_exists('response')) {
    /**
     * Return a new response from the application.
     *
     * @param  \Illuminate\Contracts\View\View|string|array|null  $content
     * @param  int  $status
     * @return ($content is null ? \Illuminate\Contracts\Routing\ResponseFactory : \Illuminate\Http\Response)
     */
    function response($content = null, $status = 200, array $headers = []): ResponseFactory|IlluminateResponse
    {
        $factory = app(ResponseFactory::class);

        if (func_num_args() === 0) {
            return $factory;
        }
        /** @var ResponseFactory $factory */
        return $factory->make($content ?? '', $status, $headers);
    }
}