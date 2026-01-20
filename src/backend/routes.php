<?php

use CanvasApiLibrary\Core\Models\Course;
use CanvasApiLibrary\Core\Models\Domain;
use Illuminate\Container\Container;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Router;
use Illuminate\Support\Facades\Redirect;
use illuminate\Support;

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
            return json_encode($providers->configProvider->getConfigInCourse($course));
        });

        $router->post('config', function(Request $request){
            $course = course();
            $providers = providers();
            $configData = $request->get("config");
            $decoded = json_decode($configData, true);
            if($decoded === null){
                return new Response('Invalid JSON', 400);
            }
            $providers->configProvider->saveConfig($course, $configData);
            return json_encode(['status' => 'success']);
        });
    });


    //dev utilities
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

    //utility function to set the current course in session, for when app is not yet integrated into Canvas
    $router->post('setCourse', function(Request $request){
        $domain = base64_decode($request->input('domain'));
        $courseId = $request->input('courseId');
        $domain = new Domain($domain);
        $course = new Course();
        $course->id = $courseId;
        $course->domain = $domain;

        if(session_status() == PHP_SESSION_NONE){
            session_start();
        }
        $app = Container::getInstance();
        $app->instance('api.course', $course);
    
        return "Course set to " . $courseId . " on domain " . $domain->domain;
    });

}