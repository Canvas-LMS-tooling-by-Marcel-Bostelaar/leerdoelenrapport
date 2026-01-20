<?php

namespace App\Providers\Interfaces;

use App\Models\Config\FullConfig;
use CanvasApiLibrary\Core\Models\CourseStub;

interface ConfigProviderInterface
{
    public function getConfigInCourse(CourseStub $course, bool $skipCache = false, bool $doNotCache = false) : FullConfig;

    public function saveConfig(CourseStub $course, FullConfig $config) : void;
}