<?php

namespace App\Controllers;

use App\Models\Config\FullConfig;
use Illuminate\Http\Response;
use Illuminate\Http\Request;

class ConfigController
{
    public function get(){
        $course = course();
        $providers = providers();
        $rawProviders = providersRaw();
        return jsonResponse($providers->configProvider->getConfigInCourse($course)
        ->toArray(
            $rawProviders->outcomeProvider, 
            $rawProviders->sectionProvider, 
            true));
    }

    public function store(Request $request)
    {
        $course = course();
        $providers = providers();

        $rawBody = $request->getContent();
        $configData = json_decode($rawBody, true);

        if ($configData === null) {
            return new Response('No config data sent', 400);
        }

        $config = FullConfig::fromArray($configData); // Validate config data

        $providers->configProvider->saveConfig($course, $config);
        return response("successfully saved config");
    }

    public function revalidateConfig(Request $request){
        $course = course();
        $providers = providers();
        $providersRaw = providersRaw();

        $rawBody = $request->getContent();
        $configData = json_decode($rawBody, true);

        if ($configData === null) {
            return new Response('No config data sent', 400);
        }

        $config = FullConfig::fromArray($configData); // Validate config data

        $newConfig = $providers->configProvider->reconcile($course, $config);
        return jsonResponse($newConfig->toArray(
            $providersRaw->outcomeProvider, 
            $providersRaw->sectionProvider, 
            true));
    }
}