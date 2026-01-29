<?php

namespace App\Models\Progressscores;

use App\Models\Config\OutcomePlanning;
use CanvasApiLibrary\Core\Models\Outcome;
use CanvasApiLibrary\Core\Models\OutcomeResult;
use Exception;

class RegularOutcomeProgressScore extends AbstractProgressScore {

    public bool $isAboveEndlevel = false;

    public public function __construct(OutcomeResult $result, OutcomePlanning $planning, int $periodNumberForReport) {
        parent::__construct($result, $planning);

        $actualScore = $result->score;
        $highestPlannedScore = max($planning->periodLevels);
        $correctedLevel = min($actualScore, $highestPlannedScore);
        if($highestPlannedScore < $actualScore){
            $this->isAboveEndlevel = true;
        }

        $gapFilledPlanning = $this::getGapFilledPlanning($planning);

        

        // 0 planned level in planning on left is valid value
        // Close all other 0/unknown gaps within the same level span.
        //In a range, use fractional values. Having achieved it right in the middle means you're exactly on track.
        /**
         * Als je 4 periodes doet over het leren van beginner leerdoel, 
         * en je hebt het in de 1e periode niet gehaald, 
         * dan loop je 0.25 punten achter. 
         * Andersom, als je het in de 1e periode gehaald hebt, 
         * loopt je 0.75 punten voor.
         */
        //Between end of lvl 1 and start lvl 2, if nothing planned in that period, show just 1 outcome behind. 
        //      Add multiplier (configurable), that takes amount of periods between current and last of lvl 1, and multiply with it 
        //      (ie if mult is 0 and not achieved, just show -1, if mult is 0.5, score = -1 - 0.5 * amounts of periods since)
        //Do not calc additional positive score if on track but nothing has been planned for some periods.
        //Use same mult score if student is ahead before it even started.
        //If score above highest planned level, treat as highest planned level for overal calculation.
    }

    private static function getGapFilledPlanning(OutcomePlanning $planning){
        $periodLevelsGapfilled = [
            0 => [
                "start" => 0
            ]
        ];
        $currentlvl = 0;
        $lastKey = 0;
        $keys = array_keys($planning->periodLevels);
        sort($keys);
        foreach($keys as $key){
            $periodLevel = $planning->periodLevels[$key];
            if($periodLevel > $currentlvl){
                $periodLevelsGapfilled[$currentlvl]["end"] = $lastKey;
                $periodLevelsGapfilled[$periodLevel] = [
                    "start" => $key
                ];
                $currentlvl = $periodLevel;
            }
            $lastKey = $key;
        }

        $periodLevelsGapfilled[$currentlvl]['end'] = $lastKey;

        //catch p1 is not 0
        if($periodLevelsGapfilled[0]['end'] == 0){
            unset($periodLevelsGapfilled[0]);
        }
        return $periodLevelsGapfilled;
    }
}