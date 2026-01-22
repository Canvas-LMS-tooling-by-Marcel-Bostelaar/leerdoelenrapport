<?php

namespace App\Exceptions;

use CanvasApiLibrary\Core\Providers\Utility\Results\ErrorResult;
use CanvasApiLibrary\Core\Providers\Utility\Results\NotFoundResult;
use CanvasApiLibrary\Core\Providers\Utility\Results\UnauthorizedResult;
use Exception;
use Throwable;

/**
 * Throw this to pass an unexpected result back up, catch in provider.
 * bit of an escape hatch.
 */
class ResultControlFlowEscapehatchException extends Exception
{
    public function __construct(ErrorResult|UnauthorizedResult|NotFoundResult $encounteredResult, string $message = "", int $code = 0, ?Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
        $this->encounteredResult = $encounteredResult;
    }
    public ErrorResult|UnauthorizedResult|NotFoundResult $encounteredResult;
}