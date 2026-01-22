<?php

namespace App\Models\Config;

use CanvasApiLibrary\Core\Models\OutcomegroupStub;
use CanvasApiLibrary\Core\Models\OutcomeStub;
use CanvasApiLibrary\Core\Models\SectionStub;
use CanvasApiLibrary\Core\Providers\Interfaces\OutcomeProviderInterface;
use CanvasApiLibrary\Core\Providers\Interfaces\SectionProviderInterface;
use CanvasApiLibrary\Core\Providers\Utility\Lookup;

class FullConfig
{
    /**
     * Summary of groupingConfigs
     * @var GroupingConfig[]
     */
    public array $groupingConfigs = [];

    public function toArray(OutcomeProviderInterface $outcomeProvider, SectionProviderInterface $sectionProvider, bool $fullData = true): array
    {
        return [
            'groupingConfigs' => array_map(
                fn($gc) => $gc->toArray($outcomeProvider, $sectionProvider, $fullData),
                $this->groupingConfigs
            )
        ];
    }

    public static function fromArray(array $data): self
    {
        $config = new self();
        $config->groupingConfigs = array_map(
            fn($gc) => GroupingConfig::fromArray($gc),
            $data['groupingConfigs']
        );
        return $config;
    }

    public function ensureContent(): void{
        if(count($this->groupingConfigs) === 0){
            $this->groupingConfigs[] = new GroupingConfig();
        }
    }

    /**
     * Adds outcomes not in config but in given set to the config, flags outcomes in config that are missing in data as orphaned.
     * Marks all sections in config that are missing in data as orphaned.
     * @param Lookup<OutcomegroupStub, OutcomeStub>[] $outcomes
     * @param SectionStub[] $sections
     * @return void
     */
    public function reconcile(array $outcomes, array $sections){
        foreach($this->groupingConfigs as $groupingConfig){
            $groupingConfig->reconcile($outcomes, $sections);
        }
    }
}