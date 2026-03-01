<?php

namespace App\Middleware\Util;

use App\Providers\Interfaces\ConfigProviderInterface;
use App\Providers\Interfaces\ProgressScoreProviderInterface;
use CanvasApiLibrary\Core\Providers\Interfaces;

class ProviderContainer
{
    public function __construct(
        public readonly Interfaces\AssignmentProviderInterface $assignmentProvider,
        public readonly Interfaces\CourseProviderInterface $courseProvider,
        public readonly Interfaces\GroupProviderInterface $groupProvider,
        public readonly Interfaces\SectionProviderInterface $sectionProvider,
        public readonly Interfaces\SubmissionProviderInterface $submissionProvider,
        public readonly Interfaces\UserProviderInterface $userProvider,
        public readonly Interfaces\OutcomeGroupProviderInterface $outcomeGroupProvider,
        public readonly Interfaces\OutcomeProviderInterface $outcomeProvider,
        public readonly Interfaces\OutcomeResultProviderInterface $outcomeResultProvider,
        public readonly Interfaces\OutcomeResultRollupProviderInterface $outcomeResultRollupProvider,
        public readonly ConfigProviderInterface $configProvider,
        public readonly ProgressScoreProviderInterface $progressScoreProvider,
    ) {
    }
}
