<?php

namespace App\Models\Config;

use CanvasApiLibrary\Core\Models\SectionStub;

class PeriodPlanning
{
    /**
     * Summary of periods
     * @var Period[]
     */
    public array $periods;
    /**
     * Summary of sections
     * @var SectionStub[]
     */
    public array $sections;
}