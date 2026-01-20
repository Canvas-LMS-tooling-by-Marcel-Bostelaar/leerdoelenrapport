<?php

use App\Controllers\CourseContextController;
use App\Models\Config\FullConfig;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Router;

function routes(Router $router)
{

    $router->get('/', function(){
        return file_get_contents(__DIR__ . '/public/static/index.html');
    });

    $router->get('/hello', function (Request $request) {
        $providers = providers();
        return "hello world";
    });

    $router->group(['prefix' => 'api'], function (Router $router) {
        $router->get('config', function(){
            $course = course();
            $providers = providers();
            return json_encode($providers->configProvider->getConfigInCourse($course)->toArray(false)); //temp false because dummy data has no actual url to fetch with
        });

        $router->post('config', function(Request $request){
            $course = course();
            $providers = providers();

            // Prefer parsing raw JSON body sent by fetch
            $rawBody = $request->getContent();
            $configData = json_decode($rawBody, true);

            
            if ($configData === null) {
                return new Response('Missing configData', 400);
            }

            $config = FullConfig::fromArray($configData); // Validate config data

            $providers->configProvider->saveConfig($course, $config);
            return json_encode(['status' => 'success']);
        });
    });


    //dev utilities
    $router->get('cache', function(){
        if(session_status() == PHP_SESSION_NONE){
            session_start();
        }
        if(empty($_SESSION)){
            return "no cache<br><form method='post' action='/cache/clear'><button type='submit'>Clear cache</button></form>";
        }
        return "<form method='post' action='/cache/clear'><button type='submit'>Clear cache</button></form>" .
        "</br><pre>" . 
        json_encode($_SESSION, JSON_PRETTY_PRINT) . "</pre>";
    });

    $router->post('cache/clear', function(){
        if(session_status() == PHP_SESSION_NONE){
            session_start();
        }
        unset($_SESSION["urls"]);
        return "Cache cleared. <a href='/cache'>Go back</a>";
    });

    //utility function to set the current course in session, for when app is not yet integrated into Canvas
    $router->resource('setCourse', CourseContextController::class);
}