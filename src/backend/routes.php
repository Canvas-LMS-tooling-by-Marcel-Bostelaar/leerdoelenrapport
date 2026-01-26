<?php

use App\Controllers\ConfigController;
use App\Controllers\CourseContextController;
use App\Controllers\OutcomeController;
use App\Controllers\SectionController;
use App\Exceptions\ResultControlFlowEscapehatchException;
use App\Models\Config\FullConfig;
use CanvasApiLibrary\Core\Models\Outcomegroup;
use CanvasApiLibrary\Core\Providers\Utility\Lookup;
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

    $router->group(['prefix' => 'api', 'middleware' => 'ensureCourseContext'], function (Router $router) {
        $router->get('config', [ConfigController::class, 'get']);
        $router->post('config', [ConfigController::class, 'store']);
        $router->post('config/revalidate', [ConfigController::class, 'revalidateConfig']);
        $router->get('outcomes', [OutcomeController::class, "outcomegroups"]);
        $router->get('sections', [SectionController::class, "index"]);
    });

    $router->group(['prefix' => 'dev'], function (Router $router) {
        //dev utilities
        $router->get('cache', function(){
            if(session_status() == PHP_SESSION_NONE){
                session_start();
            }
            if(empty($_SESSION)){
                return "no cache<br><form method='post' action='./clear'><button type='submit'>Clear cache</button></form>";
            }
            return "<form method='post' action='./clear'><button type='submit'>Clear cache</button></form>" .
            "</br><pre>" . 
            json_encode($_SESSION, JSON_PRETTY_PRINT) . "</pre>";
        });

        $router->post('cache/clear', function(){
            if(session_status() == PHP_SESSION_NONE){
                session_start();
            }
            unset($_SESSION["urls"]);
            return "Cache cleared. <a href='./cache'>Go back</a>";
        });

        //utility function to set the current course in session, for when app is not yet integrated into Canvas
        $router->resource('setCourse', CourseContextController::class);
    });
    
}