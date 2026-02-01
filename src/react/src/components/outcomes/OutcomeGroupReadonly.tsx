import type { IOutcomePlanning } from "src/types/config";
import type { IOutcomeGrouping } from "src/types/IOutcomeGrouping";
import { OutcomePlanningReadonly } from "./OutcomePlanningReadonly";
import type { CssDecoratedIOutcomeResultGroup } from "src/types/IOutcomeResult";
import type { IProgressScore } from "src/types/IProgressScore";

type OutcomeGroupReadonlyProps = {
    grouping: IOutcomeGrouping;
    outcomeResults: CssDecoratedIOutcomeResultGroup[];
    progressScores: IProgressScore[];
    periodCount: number;
    outcomePlannings: IOutcomePlanning[];
};

export function OutcomeGroupReadonly({periodCount, outcomePlannings, grouping, outcomeResults, progressScores}: OutcomeGroupReadonlyProps) {
    const scoresAsMap = new Map<number, IProgressScore>();
    progressScores.forEach(score => {
        scoresAsMap.set(score.outcome_id, score);
    });
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
            <th key={-1}>#</th> {/*TODO hover text explaining actual score */}
            <th key={-2}>Δ</th> {/*TODO hover text explaining progress score */}
            <th key={-3}>❌</th> {/*TODO hover text explaining not proven */}
            {Array.from({length: periodCount}).map((_, index) => (
                <th key={index}>Period {index + 1}</th>
            ))}
             <th key={-4}>&gt;</th> {/*TODO hover text explaining score higher than highest planned*/}
        </tr>
    </thead>
    <tbody>
        {directChildrenSorted.map((state, index) => {
            return <OutcomePlanningReadonly 
                key={index}
                planning={state}
                periodCount={periodCount}
                outcomeResults={outcomeResults}
                progressScore={scoresAsMap.get(state.outcome.id)}
                actualTotalScore={outcomeResults.find(or => or.outcome_results.has(state.outcome.id))?.outcome_results.get(state.outcome.id)?.score || 0}
            />;
        })}
    </tbody>
    </>)}
    {subgroupsSorted.map((subgroup) => {
            return <OutcomeGroupReadonly
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