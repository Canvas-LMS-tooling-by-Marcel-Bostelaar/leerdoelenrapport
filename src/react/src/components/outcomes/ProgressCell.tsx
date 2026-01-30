import type { IProgressScore } from "src/types/IProgressScore";


export function ProgressCell({progressScore}: {progressScore: IProgressScore | undefined}) {
    let positivity = 0;
    if(progressScore !== undefined){
        if(progressScore.progress_score > 0){
            positivity = 1;
        }
        else if(progressScore.progress_score < 0){
            positivity = -1;
        }
    }
    return <td className={`cell progress-cell ${positivity === 1 ? "positive" : positivity === -1 ? "negative" : ""}`}>
        {progressScore !== undefined ? progressScore.progress_score.toFixed(2) : "0"}
    </td>;
}