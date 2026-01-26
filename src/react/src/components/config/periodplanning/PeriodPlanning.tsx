import type { IPeriodPlanning, ISection } from "../../../types/config";
import { useDerivedState, type StateSetter } from "../../../utility/useDerivedState";
import { PeriodContainer } from "./PeriodContainer";
import { SectionSelector } from "./SectionSelector";

type PeriodPlanningProps = {
    planning: IPeriodPlanning;
    setPlanning: StateSetter<IPeriodPlanning>;
    allSections: ISection[];
};

export function PeriodPlanning({planning, setPlanning, allSections}: PeriodPlanningProps){
    const [periods, setPeriods] = useDerivedState(
        planning,
        setPlanning,
        x => x.periods,
        (_, newSub) => { return { ...planning, periods: newSub } }
    );
    const [activeSections, setActiveSections] = useDerivedState(
        planning,
        setPlanning,
        x => x.sections,
        (_, newSub) => { return { ...planning, sections: newSub } }
    );

    return <>
    <SectionSelector activeSections={activeSections} setActiveSections={setActiveSections} allSections={allSections}></SectionSelector>
    <PeriodContainer periods={periods} setPeriods={setPeriods}></PeriodContainer>
    </>;
}