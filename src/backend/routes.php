<?php

use Illuminate\Http\Request;
use Illuminate\Routing\Router;
use Illuminate\Support\Facades\Redirect;

function routes(Router $router)
{

    $router->get('/', function(){
        return file_get_contents(__DIR__ . '/public/static/index.html');
    });

    $router->get('/hello', function (Request $request) {
        $providers = providers();
        return "hello world";
    });

    $router->get('cache', function(){
        if(session_status() == PHP_SESSION_NONE){
            session_start();
        }
        if(!isset($_SESSION["urls"])){
            return "no cache<br><form method='post' action='/cache/clear'><button type='submit'>Clear cache</button></form>";
        }
        return "<form method='post' action='/cache/clear'><button type='submit'>Clear cache</button></form>" .
        "</br>" . 
        json_encode($_SESSION["urls"]);
    });

    $router->post('cache/clear', function(){
        if(session_status() == PHP_SESSION_NONE){
            session_start();
        }
        unset($_SESSION["urls"]);
        return "Cache cleared. <a href='/cache'>Go back</a>";
    });

}