<?php

namespace App\Middleware;

use App\Middleware\Util\StaticClientIDProvider;

class ReadEnvFile
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
        $env = parse_ini_file('../../../.env');
        $request->attributes->set('envfile', $env);
        $response = $next($request);
        
        return $response;
    }
}