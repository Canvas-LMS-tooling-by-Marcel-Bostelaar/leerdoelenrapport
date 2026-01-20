<?php

namespace App\Middleware;

use CanvasApiLibrary\Core\Services\CanvasCommunicator;
use Error;
use Illuminate\Http\Response;

class CatchUnhandledErrors
{
    public function handle($request, $next)
    {
        if(!isset($request->attributes->get('envfile')['debug'])){
            throw new \Exception('envfile missing debug setting');
        }
        $debug = $request->attributes->get('envfile')['debug'] == 'true';
        try{
            $response = $next($request);
        } catch (Error $e){
            if($debug){
                return new Response('Unhandled error: ' . $e->getMessage() . $e->getTraceAsString(), 500);
            }
            else{
                return new Response('An internal server error occurred.', 500);
            }
        }
        catch (\Exception $e){
            if($debug){
                return new Response('Unhandled exception: ' . $e->getMessage() . $e->getTraceAsString(), 500);
            }
            else{
                return new Response('An internal server error occurred.', 500);
            }
        }
        return $response;
    }
}