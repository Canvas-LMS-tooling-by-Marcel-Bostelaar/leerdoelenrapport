<?php

namespace App\Providers\Wrappers;

use App\Models\Config\FullConfig;
use App\Providers\Interfaces\ConfigProviderInterface;
use CanvasApiLibrary\Core\Models\CourseStub;
use Closure;

/**
 * @template TSuccessResult Wrapped success type
 * @template TSuccessResult2 Returned success type
 * @template TUnauthorizedResult Wrapped type of value that an unauthorized result will emit
 * @template TUnauthorizedResult2 Returned type of value that an unauthorized result will emit
 * @template TNotFoundResult Wrapped type of value that a not found result will emit
 * @template TNotFoundResult2 Returned type of value that a not found result will emit
 * @template TErrorResult Wrapped type of value that any other error result will emit
 * @template TErrorResult2 Returned type of value that any other error result will emit
 * @implements ConfigProviderInterface<TSuccessResult2,TErrorResult2,TNotFoundResult2,TUnauthorizedResult2>
 */
class ConfigProviderWrapper implements ConfigProviderInterface{
    /**
     * @param ConfigProviderInterface $wrapped
     * @param Closure(TSuccessResult|TErrorResult|TNotFoundResult|TUnauthorizedResult) : (TSuccessResult2|TErrorResult2|TNotFoundResult2|TUnauthorizedResult2) $resultProcessor
     */
    public function __construct(private readonly ConfigProviderInterface $wrapped, private readonly Closure $resultProcessor) {
    }

    public function getConfigInCourse(CourseStub $course, bool $skipCache = false, bool $doNotCache = false) : mixed{
        $val = $this->wrapped->getConfigInCourse($course, $skipCache, $doNotCache);
        return ($this->resultProcessor)($val);
    }

    public function saveConfig(CourseStub $course, FullConfig $config) : mixed{
        $val = $this->wrapped->saveConfig($course, $config);
        return ($this->resultProcessor)($val);
    }

    public function reconcile(CourseStub $course, FullConfig $config, bool $skipCache = false, bool $doNotCache = false): mixed{
        $val = $this->wrapped->reconcile($course, $config, $skipCache, $doNotCache);
        return ($this->resultProcessor)($val);
    }
}