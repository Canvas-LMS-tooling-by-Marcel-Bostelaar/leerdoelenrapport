<?php
/* Automatically generated to provide array mapped versions of methods in a provider, 
as well as missing alias methods for models with multiple plural names.
Using provider and plurals defined in the models. */

namespace App\Providers\Traits;

use App\Models\Config\GroupingConfig;
use App\Models\Progressscores\RegularOutcomeProgressScore;
use CanvasApiLibrary\Core\Providers\Utility\Lookup;
use CanvasApiLibrary\Core\Providers\Utility\Results\ErrorResult;
use CanvasApiLibrary\Core\Providers\Utility\Results\NotFoundResult;
use CanvasApiLibrary\Core\Providers\Utility\Results\SuccessResult;
use CanvasApiLibrary\Core\Providers\Utility\Results\UnauthorizedResult;
use CanvasApiLibrary\Core\Models\CourseStub;
use CanvasApiLibrary\Core\Models\UserStub;

trait ProgressScoreProviderTrait{
    

    abstract public function getProgressScoresForStudent(UserStub $student, GroupingConfig $config, CourseStub $course, float $aheadBehindPeriodPentalty, int $period, bool $skipCache = false, bool $doNotCache = false) : mixed;
    
    /** Summary of getProgressScoresForStudents 
    * This is a plural version of getProgressScoresForStudent 
    * @param UserStub[] $students
    * @param GroupingConfig $config
    * @param CourseStub $course
    * @param float $aheadBehindPeriodPentalty
    * @param int $period
    * @param bool $skipCache
    * @param bool $doNotCache
    * @return ErrorResult|NotFoundResult|SuccessResult<Lookup<UserStub, RegularOutcomeProgressScore>>|UnauthorizedResult     
    */
    public function getProgressScoresForStudents(array $students, GroupingConfig $config, CourseStub $course, float $aheadBehindPeriodPentalty, int $period, bool $skipCache = false, bool $doNotCache = false): SuccessResult|ErrorResult|NotFoundResult|UnauthorizedResult {
        $lookup = new Lookup();
        foreach($students as $x){
            $result = $this->getProgressScoresForStudent($x, $config, $course, $aheadBehindPeriodPentalty, $period, $skipCache, $doNotCache);
            if(!$result instanceof SuccessResult){
                return $result;
            }
            foreach($result->value as $y){
                $lookup->add($x, $y);
            }
        }
        return new SuccessResult($lookup);
    }

}
