<?php

namespace App\Middleware;

use App\Middleware\Util\StaticClientIDProvider;

class StaticApiKeyMiddleware
{
    /**
     * Handle the request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  callable  $next
     * @return mixed
     */
    public function handle($request, $next)
    {
        if(!isset($request->attributes->get('envfile')['apikey'])) {
            throw new \RuntimeException('apikey environment variable is not set.');
        }
        $apiKey = $request->attributes->get('envfile')['apikey'];
        $clientIDProvider = new StaticClientIDProvider($apiKey);

        $request->attributes->set('ApiKey', $apiKey);
        $request->attributes->set('ClientIDProvider', $clientIDProvider);
        $response = $next($request);
        
        return $response;
    }
}