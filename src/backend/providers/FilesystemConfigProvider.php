<?php

namespace App\Providers;

use App\Models\Config\FullConfig;
use App\Models\Unit;
use App\Providers\Interfaces\ConfigProviderInterface;
use CanvasApiLibrary\Caching\AccessAware\Providers\OutcomeGroupProviderCached;
use CanvasApiLibrary\Caching\AccessAware\Providers\OutcomeProviderCached;
use CanvasApiLibrary\Caching\AccessAware\Providers\SectionProviderCached;
use CanvasApiLibrary\Core\Models\CourseStub;
use CanvasApiLibrary\Core\Models\Outcome;
use CanvasApiLibrary\Core\Providers\OutcomegroupProvider;
use CanvasApiLibrary\Core\Providers\OutcomeProvider;
use CanvasApiLibrary\Core\Providers\SectionProvider;
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

    public function __construct(
        private readonly string $storageDir,
        private readonly SectionProvider|SectionProviderCached $sectionProvider,
        private readonly OutcomeProvider|OutcomeProviderCached $outcomeProvider,
        private readonly OutcomegroupProvider|OutcomeGroupProviderCached $outcomeGroupProvider
        ) {
    }
    private function getStorageDir(): string
    {
        return $this->storageDir;
    }

    private function getCourseFilePath(CourseStub $course): string
    {
        $filename = 'config_' . $course->id . "_" . hash('sha256', $course->domain->domain) . '.json';
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
        $config = null;

        if (!file_exists($filePath)) {
            $config = new FullConfig();
        }
        else{
            $contents = file_get_contents($filePath);
            if ($contents === false) {
                return new ErrorResult(["Failed to read config file for course " . $course->getId()]);
            }

            $data = json_decode($contents, true);
            if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
                return new ErrorResult(['Failed to decode config JSON for course ' . $course->getId() . ': ' . json_last_error_msg()]);
            }

            $config = FullConfig::fromArray($data);
        }

        //reconcile with current outcomes and sections
        $outcomes = $this->outcomeGroupProvider->getOutcomegroupsInCourse($course)
        ->flatMapSuccess(fn($groups) => $this->outcomeProvider->getOutcomesInOutcomegroups($groups, $skipCache, $doNotCache))
        ->mapSuccess(fn($outcomes) => $outcomes->getAll())
        ->mapSuccess(fn($y) => array_merge(...$y));

        if(!$outcomes instanceof SuccessResult){
            return $outcomes;
        }
        /**
         * @var Outcome[]
         */
        $outcomes = $outcomes->value;
        
        $sections = $this->sectionProvider->getAllSectionsInCourse($course, $skipCache, $doNotCache);
        if(!$sections instanceof SuccessResult){
            return $sections;
        }
        $config->ensureContent();
        $config->reconcile($outcomes, $sections->value);
        
        // @phpstan-ignore-next-line
        return new SuccessResult($config);
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

        $encoded = json_encode($config->toArray($this->outcomeProvider, $this->sectionProvider, false), JSON_PRETTY_PRINT);
        if ($encoded === false) {
            return new ErrorResult(['Unable to encode config for course ' . $course->getId() . ': ' . json_last_error_msg()]);
        }

        if (file_put_contents($filePath, $encoded) === false) {
            return new ErrorResult(['Unable to write config file for course ' . $course->getId()]);
        }
        return new SuccessResult(new Unit());
    }
}