<?php

namespace App\Middleware;

use App\Providers\FilesystemConfigProvider;
use CanvasApiLibrary\Core\Services\CanvasCommunicator;

class FilesystemConfigSetup
{
    public function handle($request, $next)
    {
        if(!isset($request->attributes->get('envfile')['configfolder'])) {
            throw new \RuntimeException('configfolder environment variable is not set.');
        }
        $configFolder = $request->attributes->get('envfile')['configfolder'];
        $configProvider = new FilesystemConfigProvider($configFolder);
        $request->attributes->set('ConfigProvider', $configProvider);
        $response = $next($request);
        return $response;
    }
}