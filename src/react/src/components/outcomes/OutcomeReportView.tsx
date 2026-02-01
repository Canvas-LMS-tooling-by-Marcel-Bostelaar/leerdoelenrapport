import { useEffect, useState } from "react";
import { OutcomeGroupReadonly } from "./OutcomeGroupReadonly";
import type { IProgressScore } from "src/types/IProgressScore";
import { loadProgressScores } from "src/utility/apiCalls";
import type { IOutcomeGrouping } from "src/types/IOutcomeGrouping";
import type { CssDecoratedIOutcomeResultGroup } from "src/types/IOutcomeResult";
import type { IOutcomePlanning } from "src/types/config";
import { FormatPositivity, GetPositivityLabel } from "src/utility/positivity";
import { sumOutcomeProgress } from "src/utility/progressSummary";
import { DateToTimeAgo } from "src/utility/dateToXAgo";

type OutcomeReportViewProps = {
    studentId: number;
    groupingConfigName: string;
    grouping: IOutcomeGrouping;
    periodCount: number;
    outcomeResults: CssDecoratedIOutcomeResultGroup[];
    outcomePlannings: IOutcomePlanning[];
};

export function OutcomeReportView({studentId, groupingConfigName, grouping, periodCount, outcomeResults, outcomePlannings}: OutcomeReportViewProps){
    const [progressScores, setProgressScores] = useState<IProgressScore[]>([]);

    useEffect(() =>{
        loadProgressScores(studentId, groupingConfigName, 0.0, 4, setProgressScores);
    }, [studentId, groupingConfigName]);

    const {overallProgressScoreWeighted, overallBehindCount, overallBehindScore, lastGraded} = sumOutcomeProgress(progressScores, outcomePlannings);



    return <div>
        Overal score (weighted), 0 is on track: <span className={"scorecolor_" +GetPositivityLabel(overallProgressScoreWeighted)}>{FormatPositivity(overallProgressScoreWeighted)}</span><br/>
        Behind on outcomes: (weighted): {overallBehindCount}<br/>
        Behind by amount: (weighted): {FormatPositivity(overallBehindScore)}<br/>
        Last graded: {DateToTimeAgo(lastGraded)}<br/>
        <OutcomeGroupReadonly
            grouping={grouping}
            outcomeResults={outcomeResults}
            periodCount={periodCount}
            outcomePlannings={outcomePlannings}
            progressScores={progressScores}
        />
    </div>
}