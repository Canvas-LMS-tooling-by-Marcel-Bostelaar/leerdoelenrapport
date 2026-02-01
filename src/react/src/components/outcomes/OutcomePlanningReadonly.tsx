import type { IOutcomePlanning } from "src/types/config";
import "src/components/config/outcomes/OutcomePlanning.css";
import { PeriodCellReadonly } from "./PeriodCellReadonly";
import type { CssDecoratedIOutcomeResultGroup } from "src/types/IOutcomeResult";
import type { IProgressScore } from "src/types/IProgressScore";
import { ProgressCell } from "./ProgressCell";
import { groupBy, groupByMap } from "src/utility/groupBy";

type OutcomePlanningReadonlyProps = {
    planning: IOutcomePlanning;
    periodCount: number;
    outcomeResults: CssDecoratedIOutcomeResultGroup[];
    progressScore: IProgressScore | undefined;
    actualTotalScore: number;
};

export function OutcomePlanningReadonly({planning, periodCount, outcomeResults, progressScore, actualTotalScore}: OutcomePlanningReadonlyProps) {
    const highestPlannedScore = Math.max(0, ...planning.periodLevels.values())
    const relevantResults = outcomeResults.map(x => {
        return {
            css: x.cssClass,
            score: x.outcome_results.get(planning.outcome.id)?.score
        }
    })
    .filter(x => x.score !== undefined);


    //place markers on all normal (not 0th period, not end period), only if there is a score
    const markers = Array.from({length: periodCount}).flatMap((_, period) => 
        relevantResults.map(x => {
            return {
                css: x.css,
                score: x.score!,
                level: planning.periodLevels.get(period) || 0,
                period: period
        }})
    );
    let groupedByCss = groupBy(markers, x => x.css)
    let a = groupedByCss.map(x => {
        return {
            css: x.key,
            score: x.items[0].score,
            items: x.items
        }
    })
    //Filter away markers where score > period level
    let b = a.map(item => {
        return {
            ...item, 
            items: item.items.filter(period => {
                const show = (Math.floor(period.score) >= period.level);
                return show;
            }
            )
        }
    })
    //Add inf marker if score > highest planned
    let c = b.map(item => {
        if(item.score > highestPlannedScore){
            return {
                ...item,
                items: [{css: item.css, score: item.score, level: Infinity, period: periodCount}]
            };
        }
        return item;
    })
    //Remove all markers where period level is 0
    let d = c.map(item => {
        return {
            ...item,
            items: item.items.filter(x => x.level !== 0)
        }
    })
    //Shown only last marker
    let e = d.map(item => {
        if(item.score === 0 || item.items.length == 0){
            return {css: item.css, score: 0, level: 0, period: -1}
        }
        return item.items.at(-1)!;
    });

    const markersByPeriod = groupByMap(e, x=> x.period);
    const finalMarkers = Array.from({length: periodCount + 2})
    .map((_, period) => markersByPeriod.get(period - 1) || [])
    .map(x => x.map(y => {
        return {
            css: y.css,
            level: y.level,
            score: y.score
        }
    }));

    return <>
    <tr>
        <td className="cell">
            {planning.outcome.title} {planning.status === "enabled_uncounted" ? (<NotCountedElement/>) : <></>}
        </td>
        <ProgressCell progressScore={progressScore} actualTotalScore={actualTotalScore}/>
        { finalMarkers.map((x, index) => (
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