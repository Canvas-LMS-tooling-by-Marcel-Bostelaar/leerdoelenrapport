<?php

namespace App\Providers;

use App\Models\Config\FullConfig;
use App\Providers\Interfaces\ConfigProviderInterface;
use CanvasApiLibrary\Core\Models\CourseStub;
use Exception;
use OndrejVrto\FilenameSanitize\FilenameSanitize;


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
        $filename = rtrim($this->getStorageDir(), "/\\") . '/config-' . $course->getResourceKey() . '.json';
        return FilenameSanitize::of($filename)->get();
    }

    public function getConfigInCourse(CourseStub $course, bool $skipCache = false, bool $doNotCache = false) : FullConfig{
        $filePath = $this->getCourseFilePath($course);

        if (!file_exists($filePath)) {
            return new FullConfig();
        }

        $contents = file_get_contents($filePath);
        if ($contents === false) {
            throw new Exception('Failed to read config file for course ' . $course->getId());
        }

        $data = json_decode($contents, true);
        if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('Invalid config JSON for course ' . $course->getId() . ': ' . json_last_error_msg());
        }

        return FullConfig::fromArray($data);
    }

    public function saveConfig(CourseStub $course, FullConfig $config) : void{
        $filePath = $this->getCourseFilePath($course);
        $directory = dirname($filePath);

        if (!is_dir($directory) && !mkdir($directory, 0777, true) && !is_dir($directory)) {
            throw new Exception('Unable to create config directory at ' . $directory);
        }

        $encoded = json_encode($config->toArray(), JSON_PRETTY_PRINT);
        if ($encoded === false) {
            throw new Exception('Unable to encode config for course ' . $course->getId() . ': ' . json_last_error_msg());
        }

        if (file_put_contents($filePath, $encoded) === false) {
            throw new Exception('Unable to write config file for course ' . $course->getId());
        }
    }
}