import type { IOutcomePlanning } from "src/types/config";
import type { IProgressScore } from "src/types/IProgressScore";


export function sumOutcomeProgress(progressScores: IProgressScore[], outcomePlannings: IOutcomePlanning[]){
    const relevantProgressScores = progressScores.filter(x => outcomePlannings.find(y => y.outcome.id === x.outcome_id)?.status === "enabled");

    // const overalRealScore = progressScores.reduce((acc, score) => acc + score.progress_score, 0);
    const overallProgressScoreWeighted = relevantProgressScores.reduce((acc, score) => acc + score.weighted_progress_score, 0);
    const overallBehind = relevantProgressScores
        .filter(score => score.weighted_progress_score < 0);
    const overallBehindScore = overallBehind
        .reduce((acc, score) => acc + score.weighted_progress_score, 0);
    const lastDate = relevantProgressScores
        .map(score => score.last_graded_at)
        .sort((a, b) => b.getTime() - a.getTime())[0];
    return {
        overallProgressScoreWeighted,
        overallBehindCount: overallBehind.length,
        overallBehindScore,
        lastGraded: lastDate || new Date(0)
    }
}