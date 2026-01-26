import type { IPeriod } from "src/types/config";
import { useDerivedArrayState } from "src/utility/useDerivedArrayState";
import type { StateSetter } from "src/utility/useDerivedState";

type PeriodContainerProps = {
    periods: IPeriod[];
    setPeriods: StateSetter<IPeriod[]>;
};

export function PeriodContainer({periods, setPeriods}: PeriodContainerProps){
    const states = useDerivedArrayState(periods, setPeriods)
    .sort((a, b) => a.get.periodNumber - b.get.periodNumber);

    //TODO check if no overlap in periods, make red if it is.
    //TODO check if startDate is before endDate, make red if not.
    //TODO add check for identical period numbers. Make red if so.

    return <div>
        {states.map((item, index) => (
            <SinglePeriodContainer
                key={index}
                period={item.get}
                setPeriod={item.set}
                deletePeriod={item.delete}
            />
        ))}
        <button onClick={() => {
            setPeriods([...periods, {
                periodNumber: periods.length > 0 ? Math.max(...periods.map(p => p.periodNumber)) + 1 : 1,
                startDate: new Date(),
                endDate: new Date(),
            }]);
        }}
        >Add Period</button>
    </div>
}

type SinglePeriodContainerProps = {
    period: IPeriod;
    setPeriod: StateSetter<IPeriod>;
    deletePeriod: () => void;
};

function SinglePeriodContainer({period, setPeriod, deletePeriod}: SinglePeriodContainerProps){
    return <div>
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
            setPeriod({...period, endDate: newDate});
        }} />
        </label>
    </div>
}