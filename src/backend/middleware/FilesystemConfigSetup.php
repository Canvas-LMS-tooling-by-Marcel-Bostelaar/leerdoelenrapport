<?php

namespace App\Middleware;

use App\Providers\FilesystemConfigProvider;
use CanvasApiLibrary\Core\Services\CanvasCommunicator;

class FilesystemConfigSetup
{
    public function handle($request, $next)
    {
        $env = parse_ini_file('../../../.env');
        $configFolder = $env["configfolder"];
        if ($configFolder === false) {
            throw new \RuntimeException('configfolder environment variable is not set.');
        }
        $configProvider = new FilesystemConfigProvider($configFolder);
        $request->attributes->set('ConfigProvider', $configProvider);
        $response = $next($request);
        return $response;
    }
}