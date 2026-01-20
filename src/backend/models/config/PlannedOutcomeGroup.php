<?php

namespace App\Models\Config;

use App\Middleware\Util\ProviderContainer;

class PlannedOutcomeGroup
{
    /**
     * An array of OutcomePlanning and PlannedOutcomeGroup objects.
     * @var (PlannedOutcomeGroup|OutcomePlanning)[]
     */
    public array $outcomesOrGroups = [];

    public function toArray(): array
    {
        return [
            'outcomesOrGroups' => array_map(fn($x) => $x->toArray(), $this->outcomesOrGroups)
        ];
    }

    public static function fromArray(array $data): self
    {
        $group = new self();
        $group->outcomesOrGroups = array_map(function($item) {
            if(isset($item['outcomesOrGroups'])) {
                return PlannedOutcomeGroup::fromArray($item);
            } else {
                return OutcomePlanning::fromArray($item);
            }
        }, $data['outcomesOrGroups']);
        return $group;
    }
}