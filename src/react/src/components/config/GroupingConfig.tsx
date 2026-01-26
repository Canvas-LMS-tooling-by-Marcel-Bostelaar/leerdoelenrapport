import type { IGroupingConfig, ISection } from "src/types/config";
import type { IOutcomeGrouping } from "src/types/IOutcomeGrouping";
import { AreYouSureDelete } from "src/utility/prompt";
import { useDerivedState, type StateSetter } from "src/utility/useDerivedState";
import { OutcomeGroup } from "src/components/config/outcomes/OutcomeGroup";
import { PeriodPlanningGroups } from "src/components/config/periodplanning/PeriodPlanningGroups";

type GroupingConfigProps = {
    config: IGroupingConfig;
    setConfig: StateSetter<IGroupingConfig>;
    deleteConfig: () => void;
    grouping: IOutcomeGrouping;//grouping is read-only, changes are done via regular canvas functionality
    allSections: ISection[];
};

export function GroupingConfig({config, setConfig, deleteConfig, grouping, allSections}: GroupingConfigProps) {
    const [periodCount, setPeriodCount] = useDerivedState(
        config,
        setConfig,
        c => c.periodCount,
        (c, newPC) => {return {...c, periodCount: newPC}}
    );
    const [name, setName] = useDerivedState(
        config,
        setConfig,
        c => c.name,
        (c, newName) => {return {...c, name: newName}}
    );
    const [outcomePlannings, setOutcomePlannings] = useDerivedState(
        config,
        setConfig,
        (config) => config.outcomePlannings,
        (config, newOutcomePlannings) => ({...config, outcomePlannings: newOutcomePlannings})
    );
    const [periodPlannings, setPeriodPlannings] = useDerivedState(
        config,
        setConfig,
        (config) => config.periodPlannings,
        (config, newPeriodPlannings) => ({...config, periodPlannings: newPeriodPlannings})
    );

    return <div>
    <button onClick={() => AreYouSureDelete(deleteConfig)}>Delete</button>
    <label>Name: <input type="text" value={name} onChange={e => setName(e.target.value)}/></label>
    <br/>
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