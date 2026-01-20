<?php

namespace App\Models\Config;

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
            'outcomesOrGroups' => array_map(function($item) {
                $itemData = $item->toArray();
                $itemData['__type'] = $item instanceof PlannedOutcomeGroup ? 'PlannedOutcomeGroup' : 'OutcomePlanning';
                return $itemData;
            }, $this->outcomesOrGroups)
        ];
    }

    public static function fromArray(array $data): self
    {
        $group = new self();
        $group->outcomesOrGroups = array_map(function($item) {
            $type = $item['__type'] ?? null;
            unset($item['__type']);
            
            if ($type === 'PlannedOutcomeGroup') {
                return PlannedOutcomeGroup::fromArray($item);
            } else {
                return OutcomePlanning::fromArray($item);
            }
        }, $data['outcomesOrGroups'] ?? []);
        return $group;
    }
}