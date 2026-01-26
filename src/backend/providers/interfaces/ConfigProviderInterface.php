<?php

namespace App\Providers\Interfaces;

use App\Models\Config\FullConfig;
use CanvasApiLibrary\Core\Models\CourseStub;
use App\Models\Unit;
use TErrorResult;

/**
 * @template TSuccessResult The type that a successful result will emit, which itself should be a class with a generic type.
 * @template TUnauthorizedResult Type of value that an unauthorized result will emit
 * @template TNotFoundResult Type of value that a not found result will emit
 * @template TErrorResult Type of value that any other error result will emit
 */
interface ConfigProviderInterface
{
    /**
     * Summary of getConfigInCourse
     * @param CourseStub $course
     * @param bool $skipCache
     * @param bool $doNotCache
     * @return TSuccessResult<TSuccessResult>|TErrorResult|TNotFoundResult|TUnauthorizedResult
     */
    public function getConfigInCourse(CourseStub $course, bool $skipCache = false, bool $doNotCache = false) : mixed;

    /**
     * Summary of saveConfig
     * @param CourseStub $course
     * @param FullConfig $config
     * @return TSuccessResult<Unit>|TErrorResult|TNotFoundResult|TUnauthorizedResult
     */
    public function saveConfig(CourseStub $course, FullConfig $config) : mixed;

    /**
     * Reconciles the provided configuration with the current outcomes and sections in the course.
     * @param CourseStub $course
     * @param FullConfig $config
     * @param bool $skipCache
     * @param bool $doNotCache
     * @return TErrorResult|TNotFoundResult|TSuccessResult<FullConfig>|TUnauthorizedResult
     */
    public function reconcile(CourseStub $course, FullConfig $config, bool $skipCache = false, bool $doNotCache = false): mixed;
}