import type { IPeriod } from "src/types/config";
import { useDerivedArrayState } from "src/utility/useDerivedArrayState";
import type { StateSetter } from "src/utility/useDerivedState";
import "./PeriodContainer.css";

type PeriodContainerProps = {
    periods: IPeriod[];
    setPeriods: StateSetter<IPeriod[]>;
};

export function PeriodContainer({periods, setPeriods}: PeriodContainerProps){
    const states = useDerivedArrayState(periods, setPeriods)
    .sort((a, b) => a.get.periodNumber - b.get.periodNumber);

    let overlappingIndices = hasOverlapDatesList(periods);
    let duplicatePeriodIndexes = getInvalidPeriodIndices(periods);
    let invalidPeriodIndexes = new Set(periods.map((period, index) => isInvalidPeriod(period) ? index : -1).filter(index => index !== -1));

    return <div>
        {states.map((item, index) => (
            <SinglePeriodContainer
                key={index}
                period={item.get}
                setPeriod={item.set}
                deletePeriod={item.delete}
                overlaps={overlappingIndices.has(index)}
                invalid={invalidPeriodIndexes.has(index)}
                duplicate={duplicatePeriodIndexes.has(index)}
            />
        ))}
        <button onClick={() => {
            let startDate = new Date();
            let endDate = new Date();
            startDate.setHours(0,0,1);
            endDate.setHours(23,59,59);
            setPeriods([...periods, {
                periodNumber: periods.length > 0 ? Math.max(...periods.map(p => p.periodNumber)) + 1 : 1,
                startDate: startDate,
                endDate: endDate,
            }]);
        }}
        >Add Period</button>
    </div>
}

type SinglePeriodContainerProps = {
    period: IPeriod;
    setPeriod: StateSetter<IPeriod>;
    deletePeriod: () => void;
    overlaps: boolean;
    invalid: boolean;
    duplicate: boolean;
};

function SinglePeriodContainer({period, setPeriod, deletePeriod, overlaps, invalid, duplicate}: SinglePeriodContainerProps){
    let className = "";
    if (overlaps) className += "overlapping-period ";
    if (invalid) className += "invalid-period ";
    if (duplicate) className += "duplicate-period ";

    return <div className={className}>
        <label>Period Number<input type="number" min={1} value={period.periodNumber} onChange={(e) => {
            const newNumber = parseInt(e.target.value);
            setPeriod({...period, periodNumber: newNumber});
        }} />
        </label>
        <button onClick={deletePeriod}>🗑️</button>
        <label>Start Date<input type="date" value={period.startDate.toISOString().substring(0,10)} onChange={(e) => {
            const newDate = new Date(e.target.value);
            setPeriod({...period, startDate: newDate});
        }} />
        </label>
        <label>End Date<input type="date" value={period.endDate.toISOString().substring(0,10)} onChange={(e) => {
            const newDate = new Date(e.target.value);
            newDate.setHours(23,59,59);
            setPeriod({...period, endDate: newDate});
        }} />
        </label>
        {overlaps && <span>⚠️ Overlaps with another period</span>}
        {invalid && <span>⚠️ Startdate is after enddate</span>}
        {duplicate && <span>⚠️ Duplicate period number</span>}
    </div>
}

function hasOverlapDates(periodA: IPeriod, periodB: IPeriod): boolean {
    return (periodA.startDate <= periodB.endDate) && (periodA.endDate >= periodB.startDate);
}

function hasOverlapDatesList(periodList: IPeriod[]): Set<number>{
    let overlappingIndices: Set<number> = new Set();
    for(let i = 0; i < periodList.length; i++){
        for(let j = i + 1; j < periodList.length; j++){
            if(hasOverlapDates(periodList[i], periodList[j])){
                overlappingIndices.add(i);
                overlappingIndices.add(j);
            }
        }
    }
    return overlappingIndices;
}

function isInvalidPeriod(period: IPeriod): boolean {
    return period.startDate > period.endDate;
}

function getInvalidPeriodIndices(periodList: IPeriod[]): Set<number> {
    let periods = new Map<number, number>(); // periodNumber -> count
    periodList.forEach((period) => {
        periods.set(period.periodNumber, (periods.get(period.periodNumber) || 0) + 1);
    });
    let invalidIndices: Set<number> = new Set();
    periodList.forEach((period, index) => {
        if((periods.get(period.periodNumber) || 0) > 1){
            invalidIndices.add(index);
        }
    });
    return invalidIndices;
}