import type { IOutcomePlanning } from "src/types/config";
import type { IOutcomeGrouping } from "src/types/IOutcomeGrouping";
import { OutcomePlanningReadonly } from "./OutcomePlanningReadonly";
import type { IOutcomeResultGroup } from "src/types/IOutcomeResult";

type OutcomeGroupReadonlyProps = {
    outcomePlannings: IOutcomePlanning[];
    grouping: IOutcomeGrouping;
    periodCount: number;
    outcomeResults: IOutcomeResultGroup[];
};

export function OutcomeGroupReadonly({outcomePlannings, grouping, periodCount, outcomeResults}: OutcomeGroupReadonlyProps) {

    const filtered = outcomePlannings
        //filter to only direct children of this grouping
        .filter(op => grouping.child_outcomes.includes(op.outcome.id))
        .filter(op => op.status !== 'disabled' && op.status !== "orphaned");
    const directChildrenSorted = filtered
        //sort by title
        .sort((a, b) => {
            const titleA = a.outcome.title.toLowerCase();
            const titleB = b.outcome.title.toLowerCase();
            return titleA.localeCompare(titleB);
        });

    const subgroupsSorted = Array.from(grouping.child_groups).sort((a, b) => {
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();
        return titleA.localeCompare(titleB);
    });

    return<>
    <thead>
        <tr>
            <th colSpan={periodCount}>{grouping.title}</th>
            
        </tr>
        <tr>
            <th>Outcome</th>
            {Array.from({length: periodCount}).map((_, index) => (
                <th key={index}>Period {index + 1}</th>
            ))}
        </tr>
    </thead>
    <tbody>
        {directChildrenSorted.map((state, index) => {
            return <OutcomePlanningReadonly 
                key={index}
                planning={state}
                periodCount={periodCount}
                outcomeResults={outcomeResults}/>
        })}
    </tbody>
    {subgroupsSorted.map((subgroup) => {
            return <OutcomeGroupReadonly
                key={subgroup.id}
                outcomePlannings={outcomePlannings}
                grouping={subgroup}
                periodCount={periodCount}
                outcomeResults={outcomeResults}
            />;
        })}
    </>;
}