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
                'parent outcome id' => $group->parent_outcome_group?->id,
                'child outcomes' => array_map(fn($x) => $x->id, $providers->outcomeProvider->getOutcomesInOutcomegroup($group)),
                'child groups' => []
            ];
        }
        $root = null;
        $byId = [];

        foreach ($asDicts as &$refItem) {
            $byId[$refItem['id']] = &$refItem;
        }

        foreach ($byId as &$node) {
            if ($node['parent outcome id'] === null) {
                $root = &$node;
            } else {
                $byId[$node['parent outcome id']]['child groups'][] = &$node;
            }
            unset($node['parent outcome id']);
        }

        return jsonResponse($root);
    }
}