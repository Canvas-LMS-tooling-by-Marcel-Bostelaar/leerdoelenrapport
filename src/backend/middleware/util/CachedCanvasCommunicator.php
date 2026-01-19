<?php

namespace CanvasApiLibrary\LearningOutcomeReport\Middleware\Util;

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
}