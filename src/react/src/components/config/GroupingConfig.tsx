import type { IGroupingConfig, IOutcomePlanning, IPeriodPlanning, ISection } from "src/types/config";
import type { IOutcomeGrouping } from "src/types/IOutcomeGrouping";
import { useDerivedState, type StateSetter } from "src/utility/useDerivedState";
import { OutcomeGroup } from "src/components/config/outcomes/OutcomeGroup";
import { PeriodPlanningGroups } from "src/components/config/periodplanning/PeriodPlanningGroups";

type GroupingConfigProps = {
    config: IGroupingConfig;
    setConfig: StateSetter<IGroupingConfig>;
    grouping: IOutcomeGrouping;//grouping is read-only, changes are done via regular canvas functionality
    allSections: ISection[];
};

export function GroupingConfig({config, setConfig, grouping, allSections}: GroupingConfigProps) {
    const [periodCount, setPeriodCount] = useDerivedState<IGroupingConfig, number>(config,setConfig,"periodCount");    
    const [outcomePlannings, setOutcomePlannings] = useDerivedState<IGroupingConfig, IOutcomePlanning[]>(config,setConfig,"outcomePlannings");
    const [periodPlannings, setPeriodPlannings] = useDerivedState<IGroupingConfig, IPeriodPlanning[]>(config,setConfig,"periodPlannings");
    return <div>
    <h2>Sections and periods</h2>
    <PeriodPlanningGroups plannings={periodPlannings} setPlannings={setPeriodPlannings} allSections={allSections}></PeriodPlanningGroups>
    <h2>Outcome planning</h2>
    <label>Period Count: <input type="number" value={periodCount} onChange={e => setPeriodCount(Number(e.target.value))}
    min={1}/></label>
    <table>
        <OutcomeGroup
            outcomePlannings={outcomePlannings}
            setOutcomePlannings={setOutcomePlannings}
            grouping={grouping}
            periodCount={periodCount}
        ></OutcomeGroup>
    </table>
    </div>;
}