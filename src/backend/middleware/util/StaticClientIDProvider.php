<?php

namespace CanvasApiLibrary\LearningOutcomeReport\Middleware\Util;

use CanvasApiLibrary\Core\Providers\Utility\ClientIDProvider;

class StaticClientIDProvider implements ClientIDProvider
{
    private $clientID;

    public function __construct(string $apiKey)
    {
        $this->clientID = hash('sha256', $apiKey);
    }

    /**Returns an id that identifies the current client uniquely */
    public function getClientID(): string
    {
        return $this->clientID;
    }

}