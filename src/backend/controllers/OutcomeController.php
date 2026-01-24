<?php

namespace App\Controllers;

use CanvasApiLibrary\Core\Models\Outcomegroup;

class OutcomeController
{
    public function outcomegroups(){
        $course = course();
        $providers = providers();

        /** @var Outcomegroup[] $groups*/
        $groups = $providers->outcomeGroupProvider->getOutcomegroupsInCourse($course);

        //build tree
        $asDicts = [];
        foreach($groups as $group){
            $asDicts[] = [
                'id' => $group->id,
                'title' => $group->title,
                'description' => $group->description,
                'parent_outcome_group_id' => $group->parent_outcome_group?->id,
                'child_outcomes' => array_map(fn($x) => $x->id, $providers->outcomeProvider->getOutcomesInOutcomegroup($group)),
                'child_groups' => []
            ];
        }
        $root = null;
        $byId = [];

        foreach ($asDicts as &$refItem) {
            $byId[$refItem['id']] = &$refItem;
        }

        foreach ($byId as &$node) {
            if ($node['parent_outcome_group_id'] === null) {
                $root = &$node;
            } else {
                $byId[$node['parent_outcome_group_id']]['child_groups'][] = &$node;
            }
            unset($node['parent_outcome_group_id']);
        }

        return jsonResponse($root);
    }
}