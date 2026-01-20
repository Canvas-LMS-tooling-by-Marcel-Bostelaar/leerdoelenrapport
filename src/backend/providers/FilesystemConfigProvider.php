<?php

namespace App\Providers;

use App\Models\Config\FullConfig;
use App\Models\Unit;
use App\Providers\Interfaces\ConfigProviderInterface;
use CanvasApiLibrary\Core\Models\CourseStub;
use Exception;
use OndrejVrto\FilenameSanitize\FilenameSanitize;

use CanvasApiLibrary\Core\Providers\Utility\Results\ErrorResult;
use CanvasApiLibrary\Core\Providers\Utility\Results\NotFoundResult;
use CanvasApiLibrary\Core\Providers\Utility\Results\SuccessResult;
use CanvasApiLibrary\Core\Providers\Utility\Results\UnauthorizedResult;

/**
 *  @implements ConfigProviderInterface<SuccessResult<FullConfig>,ErrorResult,NotFoundResult,UnauthorizedResult>
 */
class FilesystemConfigProvider implements ConfigProviderInterface
{

    public function __construct(private readonly string $storageDir) {
    }
    private function getStorageDir(): string
    {
        return $this->storageDir;
    }

    private function getCourseFilePath(CourseStub $course): string
    {
        $filename = FilenameSanitize::of('config-' . $course->getResourceKey() . '.json')->get();
        $filename = rtrim($this->getStorageDir(), "/\\") . '/' . $filename;
        return $filename;
    }

    /**
     * Gets the configuration for a specific course.
     * @param CourseStub $course
     * @param bool $skipCache
     * @param bool $doNotCache
     * @return ErrorResult|SuccessResult<FullConfig>|NotFoundResult|UnauthorizedResult
     */
    public function getConfigInCourse(CourseStub $course, bool $skipCache = false, bool $doNotCache = false) : mixed{
        $filePath = $this->getCourseFilePath($course);

        if (!file_exists($filePath)) {
            return new SuccessResult(new FullConfig());
        }

        $contents = file_get_contents($filePath);
        if ($contents === false) {
            return new ErrorResult(["Failed to read config file for course " . $course->getId()]);
        }

        $data = json_decode($contents, true);
        if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
            return new ErrorResult(['Failed to decode config JSON for course ' . $course->getId() . ': ' . json_last_error_msg()]);
        }

        return new SuccessResult(FullConfig::fromArray($data));
    }

    /**
     * Saves the configuration for a specific course.
     * @param CourseStub $course
     * @param FullConfig $config
     * @return ErrorResult|SuccessResult<Unit>|NotFoundResult|UnauthorizedResult
     */
    public function saveConfig(CourseStub $course, FullConfig $config) : mixed{
        $filePath = $this->getCourseFilePath($course);
        $directory = dirname($filePath);

        if (!is_dir($directory) && !mkdir($directory, 0777, true) && !is_dir($directory)) {
            return new ErrorResult(['Unable to create config directory at ' . $directory]);
        }

        $encoded = json_encode($config->toArray(false), JSON_PRETTY_PRINT);
        if ($encoded === false) {
            return new ErrorResult(['Unable to encode config for course ' . $course->getId() . ': ' . json_last_error_msg()]);
        }

        if (file_put_contents($filePath, $encoded) === false) {
            return new ErrorResult(['Unable to write config file for course ' . $course->getId()]);
        }
        return new SuccessResult(new Unit());
    }
}