<?php

namespace App\Middleware\Util;

use CanvasApiLibrary\Core\Providers;

class ProviderContainer
{
    public function __construct(
        public readonly Providers\AssignmentProvider $assignmentProvider,
        public readonly Providers\CourseProvider $courseProvider,
        public readonly Providers\GroupProvider $groupProvider,
        public readonly Providers\SectionProvider $sectionProvider,
        public readonly Providers\SubmissionProvider $submissionProvider,
        public readonly Providers\UserProvider $userProvider
    ) {
    }
}
