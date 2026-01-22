<?php

namespace App\Middleware\Util;

use CanvasApiLibrary\Core\Models\Domain;
use CanvasApiLibrary\Core\Services\CanvasCommunicator;

class CachedCanvasCommunicator extends CanvasCommunicator
{
    public function __construct(public readonly string $apiKey) {    }

    private static function ensureSession(){
        if (!isset($_SESSION)) {
            session_start();
        }
        if(!isset($_SESSION["urls"])){
            $_SESSION["urls"] = [];
        }
    }

    protected static function curlGet($url, $apiKey): array {
        self::ensureSession();
        if(isset($_SESSION["urls"][$url])){
            return $_SESSION["urls"][$url];
        }
        $response = parent::curlGet($url, $apiKey);
        $_SESSION["urls"][$url] = $response;
        return $response;
    }

    // public function Get(string $route, Domain $domain) : array{
    //     return self::curlGet($this->fixURL($route, $domain), $this->apiKey);
    // }

    // public function Put(string $route, Domain $domain, mixed $data) : array{
    //     return self::curlPut($this->fixURL($route, $domain), $this->apiKey, $data);
    // }
}