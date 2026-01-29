<?php

namespace App\Providers\Wrappers;

use App\Providers\Interfaces\ProgressScoreProviderInterface;
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
 * @implements ProgressScoreProviderInterface<TSuccessResult2,TErrorResult2,TNotFoundResult2,TUnauthorizedResult2>
 */
class ProgressScoreProviderWrapper implements ProgressScoreProviderInterface{
    /**
     * @param ProgressScoreProviderInterface $wrapped
     * @param Closure(TSuccessResult|TErrorResult|TNotFoundResult|TUnauthorizedResult) : (TSuccessResult2|TErrorResult2|TNotFoundResult2|TUnauthorizedResult2) $resultProcessor
     */
    public function __construct(private readonly ProgressScoreProviderInterface $wrapped, private readonly Closure $resultProcessor) {
    }

    public function getProgressScoresForStudent(\CanvasApiLibrary\Core\Models\UserStub $student, \App\Models\Config\GroupingConfig $config, \CanvasApiLibrary\Core\Models\CourseStub $course, float $aheadBehindPeriodPentalty, int $period, bool $skipCache = false, bool $doNotCache = false) : mixed{
        $val = $this->wrapped->getProgressScoresForStudent($student, $config, $course, $aheadBehindPeriodPentalty, $period, $skipCache, $doNotCache);
        return ($this->resultProcessor)($val);
    }

    public function getProgressScoresForStudents(array $students, \App\Models\Config\GroupingConfig $config, \CanvasApiLibrary\Core\Models\CourseStub $course, float $aheadBehindPeriodPentalty, int $period, bool $skipCache = false, bool $doNotCache = false) : mixed{
        $val = $this->wrapped->getProgressScoresForStudents($students, $config, $course, $aheadBehindPeriodPentalty, $period, $skipCache, $doNotCache);
        return ($this->resultProcessor)($val);
    }
}