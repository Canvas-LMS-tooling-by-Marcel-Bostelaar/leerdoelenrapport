import { useEffect, useState } from "react";
import type { IOutcomePlanning } from "src/types/config";
import type { IProgressScore } from "src/types/IProgressScore";
import { loadProgressScores } from "src/utility/apiCalls";
import { DateToTimeAgo } from "src/utility/dateToXAgo";
import { FormatPositivity, GetPositivityLabel } from "src/utility/positivity";
import { sumOutcomeProgress } from "src/utility/progressSummary";

type StudentSummaryProps = {
    loadData: boolean;
    signalDoneLoading: () => void;
    studentID: number;
    studentName: string;
    configGroupName: string;
    aheadBehindPentalty: number;
    period: number;
    outcomePlannings: IOutcomePlanning[];
}

export function StudentSummary({loadData, signalDoneLoading, studentID, studentName, configGroupName, aheadBehindPentalty, period, outcomePlannings}: StudentSummaryProps){
    const [progressSummary, setProgressSummary] = useState<IProgressScore[] | null>(null);

    useEffect(() => {
        if(!loadData){
            return;
        }
        loadProgressScores(studentID, configGroupName, aheadBehindPentalty, period, setProgressSummary)
        .then(() => signalDoneLoading());
    }, [loadData, studentID, configGroupName, aheadBehindPentalty, period]);

    if(progressSummary === null){
        return <StudentSummaryInternal
            studentID={studentID}
            studentName={studentName}
            overallScoreWeighted={null}
            overallBehindCount={null}
            overallBehindScore={null}
            lastGraded={null}
        />;
    }
    
    const {overallProgressScoreWeighted, overallBehindCount, overallBehindScore, lastGraded} = sumOutcomeProgress(progressSummary, outcomePlannings);

    return <StudentSummaryInternal
        studentID={studentID}
        studentName={studentName}
        overallScoreWeighted={overallProgressScoreWeighted}
        overallBehindCount={overallBehindCount}
        overallBehindScore={overallBehindScore}
        lastGraded={lastGraded}
    />;
}

type StudentSummaryInternalProps = {
    studentID: number;
    studentName: string;
    overallScoreWeighted: number | null;
    overallBehindCount: number | null;
    overallBehindScore: number | null;
    lastGraded: Date | null;
}

function StudentSummaryInternal({studentID, studentName, overallScoreWeighted, overallBehindCount, overallBehindScore, lastGraded}: StudentSummaryInternalProps){
    return <tr>
            <td>
                <a href={`/students/${studentID}/${encodeURIComponent(studentName)}`}>{studentName}</a>
                </td>
            <td className={"scoreCell_" + GetPositivityLabel(overallScoreWeighted ?? 0)}>
                Score: {overallScoreWeighted !== null ? FormatPositivity(overallScoreWeighted) : "Loading..."}
            </td>
            <td>
                Behind on: {overallBehindCount !== null ? overallBehindCount : "Loading..."}
            </td>
            <td>
                Behind by: {overallBehindScore !== null ? FormatPositivity(overallBehindScore) : "Loading..."}
            </td>
            <td>
                Last graded: {lastGraded !== null ? DateToTimeAgo(lastGraded) : "Loading..."}
            </td>
        </tr>
}

