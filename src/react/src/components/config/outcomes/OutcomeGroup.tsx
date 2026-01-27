import type { IGroupingConfig } from "src/types/config";
import type { IOutcomeGrouping } from "src/types/IOutcomeGrouping";
import { useDerivedArrayState } from "src/utility/useDerivedArrayState";
import { type StateSetter } from "src/utility/useDerivedState";
import { OutcomePlanning } from "src/components/config/outcomes/OutcomePlanning";

type OutcomeGroupProps = {
    outcomePlannings: IGroupingConfig["outcomePlannings"];
    setOutcomePlannings: StateSetter<IGroupingConfig["outcomePlannings"]>;
    grouping: IOutcomeGrouping; //grouping is read-only, changes are done via regular canvas functionality
    periodCount: number;
};

export function OutcomeGroup({outcomePlannings, setOutcomePlannings, grouping, periodCount}: OutcomeGroupProps) {

    //sorted on title alphabetically, transformed into derived states
    const states = useDerivedArrayState(outcomePlannings, setOutcomePlannings);
    const filtered = states
        //filter to only direct children of this grouping
        .filter(op => grouping.child_outcomes.includes(op.get.outcome.id));
    const directChildrenSorted = filtered
        //sort by title
        .sort((a, b) => {
            const titleA = a.get.outcome.title.toLowerCase();
            const titleB = b.get.outcome.title.toLowerCase();
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
            return <OutcomePlanning 
                key={index}
                planning={state.get}
                setPlanning={state.set} 
                deletePlanning={state.delete}
                periodCount={periodCount}>
            </OutcomePlanning>;
        })}
    </tbody>
    {subgroupsSorted.map((subgroup) => {
            return <OutcomeGroup
                key={subgroup.id}
                outcomePlannings={outcomePlannings}
                setOutcomePlannings={setOutcomePlannings}
                grouping={subgroup}
                periodCount={periodCount}
            />;
        })}
    </>;
}