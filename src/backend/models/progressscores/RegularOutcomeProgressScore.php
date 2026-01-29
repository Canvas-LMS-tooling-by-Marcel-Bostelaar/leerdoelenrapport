<?php

namespace App\Models\Progressscores;

use App\Models\Config\OutcomePlanning;
use CanvasApiLibrary\Core\Models\Outcome;
use CanvasApiLibrary\Core\Models\OutcomeResult;
use Exception;
use LogicException;

class RegularOutcomeProgressScore extends AbstractProgressScore {

    public readonly bool $isAboveEndlevel = false;

    private float $bareScore;

    /**
     * Summary of __construct
     * @param OutcomeResult $result
     * @param OutcomePlanning $planning
     * @param int $periodNumberForReport Period number (0 based) for the period for which to write the report. Will assume end of period.
     * @param float $aheadBehindPeriodPentalty A (positive) pentalty value that is awarded or subtracked for each period a student is fully behind the start/end of the planned period.
     * @return void
     */
    public public function __construct(OutcomeResult $result, OutcomePlanning $planning, int $periodNumberForReport, float $aheadBehindPeriodPentalty) {
        parent::__construct($result, $planning);

        $score = $result->score;
        $highestPlannedScore = max(0, ...$planning->periodLevels);

        if($highestPlannedScore < $score){
            $this->isAboveEndlevel = true;
        }

        $gapFilledPlanning = $this::getGapFilledPlanning($planning);
        $this->bareScore = $this::calculateScore($score, $gapFilledPlanning, $periodNumberForReport, $aheadBehindPeriodPentalty);
    }

    public float $score{
        get {
            return $this->bareScore;
        }
    }
    public float $weightedScore{
        get {
            return $this->bareScore * $this->outcomeWeight;
        }
    }

    /**
     * Calculates score. If period falls within a (filled) segment, calculates a fractional score. Ie, if target level N spans 4 periods, target level of that first period is (N-1).25.
     * For every period a student is fully behind a segment, the score difference between the expected score and actual score is summed with a pentalty for every period.
     * For every period a student is fully ahead a segment, the score difference between the expected score and actual score is summed with a pentalty for every period.
     * @param float $score The score of the student
     * @param array $gapFilledPlanning Segment list detailing when a level starts being examined and when it ends.
     * @param int $periodNumberForReport Period number the score is calculated for.
     * @param float $aheadBehindPeriodPentalty Pentalty or bonus float that is multiplied with every period a student is ahead or behind.
     * @return float
     */
    private static function calculateScore(float $score, array $gapFilledPlanning, int $periodNumberForReport, float $aheadBehindPeriodPentalty): float{
        /**
         * @var int
         */
        $highestPlannedScore = max(0, ...array_keys($gapFilledPlanning));
        $correctedScore = min($highestPlannedScore, $score);

        $relevantSegment = self::tryGetRelevantRange($gapFilledPlanning, $periodNumberForReport);

        $periodTargetScore = $relevantSegment === null ? $highestPlannedScore : $relevantSegment['score'];
        
        if(self::floatEqualsZero($correctedScore) && $periodTargetScore === 0){
            //student score is zero, and required score is zero. Always neutral score.
            return 0.0;
        }


        if($relevantSegment === null){
            //Period is not in a segment, so it is either inbetween segments, or beyond the last planned stage (0 has its own segment if it has any width)
            if($gapFilledPlanning[$highestPlannedScore]['end'] < $periodNumberForReport){
                //beyond the end
                if(self::floatEqualsZero($highestPlannedScore - $correctedScore)){
                    //Fully on track, no bonus points for being on track later in the course
                    return 0.0;
                }
                //score is below end level, so we are behind
                //No need to calculate internal scores, since just the diff between the actual score and the end target is enough.
                //Add penalty for every period behind schedule.
                $scoreDiff = $correctedScore - $highestPlannedScore; //already negative
                $periodsSince = $periodNumberForReport - $gapFilledPlanning[$highestPlannedScore]['end'];
                return $scoreDiff + ($aheadBehindPeriodPentalty * $periodsSince * -1);
            }
            else{
                [$previousSegment, $previousTargetScore] = self::tryGetPrevious($periodNumberForReport, $gapFilledPlanning);
                [$nextSegment, $nextTargetScore] = self::tryGetNext($periodNumberForReport, $gapFilledPlanning);
                
                if((int)ceil($correctedScore) >= $nextTargetScore){
                    //student is ahead of schedule
                    //recall this method with period set to start of next segment, and add a boost for every period between now and then
                    $nextStart = $nextSegment['start'];
                    $periodsAhead = $nextStart - $periodNumberForReport;
                    $score = self::calculateScore($score, $gapFilledPlanning, $nextStart, $aheadBehindPeriodPentalty);
                    return $score + ($aheadBehindPeriodPentalty * $periodsAhead);
                }
                elseif((int)floor($correctedScore) < $previousTargetScore){
                    //student is behind schedule
                    //recall this method with the period set to the end of the previous segment, and add a pentalty between now and then.
                    $prevEnd = $previousSegment['end'];
                    $periodsBehind = $periodNumberForReport - $prevEnd;
                    $score = self::calculateScore($score, $gapFilledPlanning, $prevEnd, $aheadBehindPeriodPentalty);
                    return $score + (-1 * $aheadBehindPeriodPentalty * $periodsBehind);
                }
                else{
                    //Student is on schedule exactly.
                    return 0.0;
                }
            }
        }
        else{
            //Period is in a segment.
            if((int)ceil($correctedScore) == $relevantSegment['score']){
                //Score lies within the range of the segment that period is also in. Student is going on track, set score to be internal segment score.
                return self::calcScoreWithinSegment($relevantSegment, $periodNumberForReport, $correctedScore);
            }
            //Score is out of range of this period.

            if((int)ceil($correctedScore) < $relevantSegment['score']){
                //Behind schedule
                $prevSegment = self::tryGetPrevious($periodNumberForReport, $gapFilledPlanning);
                if($prevSegment === null){
                    //current segment is leftmost (no 0 segment exist)
                    //Create virtual 0 score segment at -1
                    $prevSegment = [
                        "start" => -1,
                        "end" => -1
                    ];
                }
                else{
                    $prevSegment = $prevSegment[0];
                }
                $scoreDiff = $correctedScore - $relevantSegment['score'] + 1; //already negative
                $periodsSince = $periodNumberForReport - $prevSegment['end'];
                //calculate internal segment score as if score is equal to target level - 1 (min score in the current segment), then subtract the difference and behind penalty.
                $internalScore = self::calcScoreWithinSegment($relevantSegment, $periodNumberForReport, $relevantSegment['score'] - 1);
                return $internalScore + $scoreDiff + ($aheadBehindPeriodPentalty * $periodsSince * -1);
            }
            else{
                //Score is higher than target level of this segment
                //Ahead of schedule, find next segment

                //Result cannot be null, as corrected score is capped at the max planned score, so you cant have a higher score than the rightmost segment
                $nextSegment = self::tryGetNext($periodNumberForReport, $gapFilledPlanning)[0];

                $scoreDiff = $correctedScore - $relevantSegment['score']; //already positive
                $periodsAhead = $nextSegment['start'] - $periodNumberForReport;
                //calculate internal segment score as if score is equal to target level (max score in the current segment), then add the difference plus ahead bonus.
                $internalScore = self::calcScoreWithinSegment($relevantSegment, $periodNumberForReport, $relevantSegment['score']);
                return $internalScore + $scoreDiff + ($aheadBehindPeriodPentalty * $periodsAhead);
            }
        }
    }

    /**
     * Calculates the score if the period is within this segment.
     * Assumes period is actually within this segment
     * @param array $segment
     * @param int $period
     * @param float $score
     * @return float Score within a period. 0 if on track exactly. Up to +(N-1/N) and -(N-1/N) if ahead or behind.
     */
    private static function calcScoreWithinSegment(array $segment, int $period, float $score): float{
        $start = $segment['segment']['start'];
        $end = $segment['segment']['end'];
        $targetScore = $segment['segment']['score'];
        $normalizedScore = max(min($score - $targetScore + 1, 1), -1); //cap normalized score to 1 and -1, so if score is above or below target, you only get the % ahead of this segment as if it was the targeted end level.

        $periodDelta = 1 / ($end - $start + 1);
        $scoreToBeOnTrack = ($period - $start + 1) * $periodDelta;
        $realizedScore = $normalizedScore - $scoreToBeOnTrack;
        return $realizedScore;
    }

    private static function tryGetRelevantRange(array $gapFilled, $period){
        foreach($gapFilled as $score => $segment){
            if($segment['start'] <= $period && $segment['end'] >= $period){
                return [
                    'score' => $score,
                    'segment' => $segment
                ];
            }
            if($segment['start'] > $period){
                return [
                    'score' => $score - 1,
                    'segment' => $segment[$score - 1]
                ];
            }
        }
        return null;
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

    /**
     * Summary of tryGetNext
     * @param int $period
     * @param array $gapfilled
     * @return mixed null | [segment, segmentScore]
     */
    private static function tryGetNext(int $period, array $gapfilled){
        foreach($gapfilled as $score => $segment){
            if($segment['start'] > $period){
                return [$segment, $score];
            }
        }
        return null;
    }

    /**
     * Summary of tryGetPrevious
     * @param int $period
     * @param array $gapfilled
     * @return mixed null | [segment, segmentScore]
     */
    private static function tryGetPrevious(int $period, array $gapfilled){
        $cloned = array_reverse($gapfilled);
        
        foreach($cloned as $score => $segment){
            if($segment['end'] < $period){
                return [$segment, $score];
            }
        }
        return null;
    }

    private static function floatEqualsZero(float $x){
        return abs($x) < PHP_FLOAT_EPSILON;
    }
}