<?php

namespace App\Providers;

use App\Models\Config\FullConfig;
use App\Providers\Interfaces\ConfigProviderInterface;
use CanvasApiLibrary\Core\Models\CourseStub;
use Exception;


class FilesystemConfigProvider implements ConfigProviderInterface
{
    public function getConfigInCourse(CourseStub $course, bool $skipCache = false, bool $doNotCache = false) : FullConfig{
        throw new Exception("Not implemented yet");
    }

    public function saveConfig(CourseStub $course, FullConfig $config) : void{
        throw new Exception("Not implemented yet");
        //save to disk
    }
}