import type { IDecoratedSection, IPeriod, IPeriodPlanning, ISection } from "src/types/config";
import { useDerivedState, type StateSetter } from "src/utility/useDerivedState";
import { PeriodContainer } from "src/components/config/periodplanning/PeriodContainer";
import { SectionSelector } from "src/components/config/periodplanning/SectionSelector";

type PeriodPlanningProps = {
    planning: IPeriodPlanning;
    setPlanning: StateSetter<IPeriodPlanning>;
    allSections: ISection[];
};

export function PeriodPlanning({planning, setPlanning, allSections}: PeriodPlanningProps){
    const [periods, setPeriods] = useDerivedState<IPeriodPlanning, IPeriod[]>(planning,setPlanning,"periods");
    const [activeSections, setActiveSections] = useDerivedState<IPeriodPlanning, IDecoratedSection[]>(planning,setPlanning,"sections");

    return <>
    <SectionSelector activeSections={activeSections} setActiveSections={setActiveSections} allSections={allSections}></SectionSelector>
    <PeriodContainer periods={periods} setPeriods={setPeriods}></PeriodContainer>
    </>;
}