<?php


$router->get('/', function(){
    return file_get_contents(__DIR__ . '/public/static/index.html');
});

$router->get('/hello', fn () => 'Hello');
