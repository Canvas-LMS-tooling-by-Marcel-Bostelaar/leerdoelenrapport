import type { IProgressScore } from "src/types/IProgressScore";
import { FormatPositivity } from "src/utility/positivity";


export function ProgressCell({progressScore, actualTotalScore}: {progressScore: IProgressScore | undefined, actualTotalScore: number}) {
    let positivity = 0;
    if(progressScore !== undefined){
        if(progressScore.progress_score > 0){
            positivity = 1;
        }
        else if(progressScore.progress_score < 0){
            positivity = -1;
        }
    }
    return <>
    <td className={`cell progress-cell ${positivity === 1 ? "positive" : positivity === -1 ? "negative" : ""}`}>
        {actualTotalScore.toFixed(1)}
    </td>
    <td className={`cell progress-cell ${positivity === 1 ? "positive" : positivity === -1 ? "negative" : ""}`}>
        {FormatPositivity(progressScore !== undefined ? progressScore.progress_score : 0)}
    </td>
    </>;
}