import type { IOutcomePlanning } from "src/types/config";
import type { IOutcomeGrouping } from "src/types/IOutcomeGrouping";
import { OutcomePlanningReadonly } from "./OutcomePlanningReadonly";
import type { CssDecoratedIOutcomeResultGroup } from "src/types/IOutcomeResult";
import { useEffect, useState } from "react";
import type { IProgressScore } from "src/types/IProgressScore";
import { loadProgressScores } from "src/utility/apiCalls";

type OutcomeGroupReadonlyProps = {
    studentId: number;
    groupingConfigName: string;
    grouping: IOutcomeGrouping;
    periodCount: number;
    outcomeResults: CssDecoratedIOutcomeResultGroup[];
    outcomePlannings: IOutcomePlanning[];
};

export function OutcomeGroupReadonly({studentId, groupingConfigName, grouping, periodCount, outcomeResults, outcomePlannings} : OutcomeGroupReadonlyProps) {
    const [progressScores, setProgressScores] = useState<IProgressScore[]>([]);

    useEffect(() =>{
        loadProgressScores(studentId, groupingConfigName, 0.0, 5, setProgressScores);
    }, [studentId, groupingConfigName]);
    
    return <OutcomeGroupReadonlyEffectless
            grouping={grouping}
            outcomeResults={outcomeResults}
            progressScores={progressScores}
            periodCount={periodCount}
            outcomePlannings={outcomePlannings}
        />;
}

type OutcomeGroupReadonlyEffectlessProps = {
    grouping: IOutcomeGrouping;
    outcomeResults: CssDecoratedIOutcomeResultGroup[];
    progressScores: IProgressScore[];
    periodCount: number;
    outcomePlannings: IOutcomePlanning[];
};

function OutcomeGroupReadonlyEffectless({periodCount, outcomePlannings, grouping, outcomeResults, progressScores}: OutcomeGroupReadonlyEffectlessProps) {

    const filtered = outcomePlannings
        //filter to only direct children of this grouping
        .filter(op => grouping.child_outcomes.includes(op.outcome.id))
        .filter(op => op.status !== 'disabled' && op.status !== "orphaned");
    const anyChildrenEnabled = getAllChildOutcomes(grouping, outcomePlannings).some(op => op.status !== 'disabled' && op.status !== "orphaned");
    const anyDirectChildrenEnabled = filtered.length > 0;
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

    return(
    !anyChildrenEnabled ? <></> :
    <>
    {anyDirectChildrenEnabled && (
    <>
    <thead>
        <tr>
            <th colSpan={periodCount + 1}>{grouping.title}</th>
            
        </tr>
        <tr>
            <th>Outcome</th>
            <th key={-1}>❌</th> {/*TODO hover text explaining not proven */}
            {Array.from({length: periodCount}).map((_, index) => (
                <th key={index}>Period {index + 1}</th>
            ))}
             <th key={-2}>&gt;</th> {/*TODO hover text explaining score higher than highest planned*/}
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
    </>)}
    {subgroupsSorted.map((subgroup) => {
            return <OutcomeGroupReadonlyEffectless
                key={subgroup.id}
                grouping={subgroup}
                outcomeResults={outcomeResults}
                progressScores={progressScores}
                periodCount={periodCount}
                outcomePlannings={outcomePlannings}
            />;
        })}
    </>);
}

function getAllChildOutcomes(grouping: IOutcomeGrouping, outcomePlannings: IOutcomePlanning[]): IOutcomePlanning[] {
    let results: IOutcomePlanning[] = [];
    // Add direct child outcomes
    results.push(...outcomePlannings.filter(op => grouping.child_outcomes.includes(op.outcome.id)));
    // Recursively add outcomes from child groups
    grouping.child_groups.forEach(subgroup => {
        results.push(...getAllChildOutcomes(subgroup, outcomePlannings));
    });
    return results;
}