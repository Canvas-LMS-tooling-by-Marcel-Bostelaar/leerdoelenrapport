import type { IOutcomePlanning } from "src/types/config";
import "src/components/config/outcomes/OutcomePlanning.css";
import { PeriodCellReadonly } from "./PeriodCellReadonly";
import type { IOutcomeResultGroup } from "src/types/IOutcomeResult";

type OutcomePlanningReadonlyProps = {
    planning: IOutcomePlanning;
    periodCount: number;
    outcomeResults: IOutcomeResultGroup[];
};

export function OutcomePlanningReadonly({planning, periodCount, outcomeResults}: OutcomePlanningReadonlyProps) {
    return <>
    <tr>
        <td className="cell">
            {planning.outcome.title} {planning.status === "enabled_uncounted" ? (<NotCountedElement/>) : <></>}
        </td>
        { Array.from({length: periodCount}).map((_, index) => (
            <PeriodCellReadonly 
                key={index}
                currentLevel={planning.periodLevels.get(index) || 0}
                outcomeID={planning.outcome.id}
                outcomeResults={outcomeResults}
            />
        ))}
    </tr>
    </>
}

function NotCountedElement(){
    return <span>💤</span>
}