import type { IOutcomePlanning } from "src/types/config";
import "src/components/config/outcomes/OutcomePlanning.css";
import { PeriodCellReadonly } from "./PeriodCellReadonly";
import type { CssDecoratedIOutcomeResultGroup } from "src/types/IOutcomeResult";

type OutcomePlanningReadonlyProps = {
    planning: IOutcomePlanning;
    periodCount: number;
    outcomeResults: CssDecoratedIOutcomeResultGroup[];
};

type lvlAndCss = {
    level: number;
    css: string;
}

type reduceType = {
    seen: Map<string, boolean>, //[cssclass, level] : hasBeenSeen
    total: lvlAndCss[][] //css classes, list of classes per period
}

export function OutcomePlanningReadonly({planning, periodCount, outcomeResults}: OutcomePlanningReadonlyProps) {
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
                        level: planning.periodLevels.get(period) || 0
                    }}
                )
            );
    //Show only the last instances of markers (but keep level 0 always)
    const onlyLastInstance = showOnlyFirstOccurrence([...markerList].reverse(), x => x.level == 0).reverse();

    //Show only first instance of 0 markers (dont process others)
    const withZeroFirst = showOnlyFirstOccurrence(onlyLastInstance, x => x.level !== 0);

    //

    return <>
    <tr>
        <td className="cell">
            {planning.outcome.title} {planning.status === "enabled_uncounted" ? (<NotCountedElement/>) : <></>}
        </td>
        { withZeroFirst.map((x, index) => (
            <PeriodCellReadonly 
                key={index}
                currentLevel={planning.periodLevels.get(index - 1) || 0}
                cssMarkerClasses={x.map(y => y.css)}
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

function showOnlyFirstOccurrence(markerList: {level: number; css: string}[][], dontProcessPredicate: (item: lvlAndCss) => boolean)     {
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