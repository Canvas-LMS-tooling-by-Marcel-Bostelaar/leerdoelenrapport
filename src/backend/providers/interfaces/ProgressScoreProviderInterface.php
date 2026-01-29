<?php

namespace App\Providers\Interfaces;

use App\Models\Config\GroupingConfig;
use App\Models\Progressscores\RegularOutcomeProgressScore;
use App\Providers\Interfaces\ConfigProviderInterface;
use App\Providers\Traits\ProgressScoreProviderTrait;
use App\Utility\OutcomesUtility;
use CanvasApiLibrary\Core\Models\CourseStub;
use CanvasApiLibrary\Core\Models\OutcomeResult;
use CanvasApiLibrary\Core\Models\UserStub;
use CanvasApiLibrary\Core\Providers\Interfaces\OutcomegroupProviderInterface;
use CanvasApiLibrary\Core\Providers\Interfaces\OutcomeProviderInterface;
use CanvasApiLibrary\Core\Providers\Interfaces\OutcomeResultProviderInterface;


/**
 * @template TSuccessResult The type that a successful result will emit, which itself should be a class with a generic type.
 * @template TUnauthorizedResult Type of value that an unauthorized result will emit
 * @template TNotFoundResult Type of value that a not found result will emit
 * @template TErrorResult Type of value that any other error result will emit
 */
interface ProgressScoreProviderInterface
{

    public function getProgressScoresForStudent(UserStub $student, GroupingConfig $config, CourseStub $course, float $aheadBehindPeriodPentalty, int $period, bool $skipCache = false, bool $doNotCache = false) : mixed;

    public function getProgressScoresForStudents(array $students, GroupingConfig $config, CourseStub $course, float $aheadBehindPeriodPentalty, int $period, bool $skipCache = false, bool $doNotCache = false) : mixed;
}