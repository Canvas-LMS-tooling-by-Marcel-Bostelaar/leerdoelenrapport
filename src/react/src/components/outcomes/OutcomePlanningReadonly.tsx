import type { IOutcomePlanning } from "src/types/config";
import "src/components/config/outcomes/OutcomePlanning.css";
import { PeriodCellReadonly } from "./PeriodCellReadonly";
import type { CssDecoratedIOutcomeResultGroup } from "src/types/IOutcomeResult";
import type { IProgressScore } from "src/types/IProgressScore";
import { ProgressCell } from "./ProgressCell";

type OutcomePlanningReadonlyProps = {
    planning: IOutcomePlanning;
    periodCount: number;
    outcomeResults: CssDecoratedIOutcomeResultGroup[];
    score: IProgressScore | undefined;
};

type lvlAndCss = {
    level: number;
    css: string;
    score: number;
}

type reduceType = {
    seen: Map<string, boolean>, //[cssclass, level] : hasBeenSeen
    total: lvlAndCss[][] //css classes, list of classes per period
}

export function OutcomePlanningReadonly({planning, periodCount, outcomeResults, score}: OutcomePlanningReadonlyProps) {
    //create list of markets per period
    const markerList = Array.from({length: periodCount + 1}).map((_, index) => index - 1)
        .map(period => 
            outcomeResults
                .filter(x => {
                    const score = x.outcome_results.get(planning.outcome.id);
                    const periodLevel = planning.periodLevels.get(period) || 0;
                    if(score === undefined){
                        return false
                    }
                    return RoughlyEquals(score.score, periodLevel)
                    }
                )
                .map(x => {
                    return {
                        css: x.cssClass,
                        level: planning.periodLevels.get(period) || 0,
                        score: x.outcome_results.get(planning.outcome.id)!.score
                    }}
                )
            );

    const aboveEndlevelColumn = outcomeResults.map(x => {return {
        outcome: x,
        result: x.outcome_results.get(planning.outcome.id)
    }})
    .filter(x => x.result !== undefined)
    .map(x => {
        const maxLevel = planning.periodLevels.size === 0 ? 0 : Math.max(...planning.periodLevels.values());
        if(x.result!.score > maxLevel ){
            return {
                css: x.outcome.cssClass,
                level: Number.POSITIVE_INFINITY,
                score: x.result!.score
            };
        }
        return undefined;
    })
    .filter(x => x !== undefined);

    const combinedMarkerList = [...markerList, aboveEndlevelColumn];

    //Show only the last instances of markers (but keep level 0 always)
    const onlyLastInstance = showOnlyFirstOccurrence([...combinedMarkerList].reverse(), x => x.level == 0).reverse();

    //Show only first instance of 0 markers (dont process others)
    const withZeroFirst = showOnlyFirstOccurrence(onlyLastInstance, x => x.level !== 0);

    //

    return <>
    <tr>
        <td className="cell">
            {planning.outcome.title} {planning.status === "enabled_uncounted" ? (<NotCountedElement/>) : <></>}
        </td>
        <ProgressCell progressScore={score} />
        { withZeroFirst.map((x, index) => (
            <PeriodCellReadonly 
                key={index}
                //Last column is for above endlevel
                currentLevel={index !== periodCount + 1 ? planning.periodLevels.get(index - 1) || 0 : Number.POSITIVE_INFINITY}
                cssMarkerClasses={x.map(y => ({css: y.css, score: y.score}))}
            />
        ))}
    </tr>
    </>
}

function NotCountedElement(){
    return <span>💤</span>
}

function RoughlyEquals(a: number, integerNumber: number){
    //TODO configure range
    return Math.round(a) == Math.round(integerNumber)
}

function showOnlyFirstOccurrence(markerList: lvlAndCss[][], dontProcessPredicate: (item: lvlAndCss) => boolean)     {
    return markerList.reduce<reduceType>((prev, curr, _, __) => {
        const doShow = curr.filter(x => dontProcessPredicate(x) || !prev.seen.has(x.css + x.level.toString()));
        let newMap = new Map(prev.seen);
        doShow.forEach(x => newMap.set(x.css + x.level.toString(), true));
        return {
            seen: newMap,
            total: [...prev.total, doShow]
        };
    }, {seen : new Map(), total: []}).total;
}