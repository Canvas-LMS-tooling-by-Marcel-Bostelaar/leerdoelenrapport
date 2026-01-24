import type { IGroupingConfig } from "../../types/config";
import type { IOutcomeGrouping } from "../../types/IOutcomeGrouping";
import { useDerivedState, type StateSetter } from "../../utility/useDerivedState";
import { OutcomeGroup } from "./OutcomeGroup";

type GroupingConfigProps = {
    config: IGroupingConfig;
    setConfig: StateSetter<IGroupingConfig>;
    grouping: IOutcomeGrouping;//grouping is read-only, changes are done via regular canvas functionality
    periodCount: number;
};

export function GroupingConfig({config, setConfig, grouping}: GroupingConfigProps) {
    const periodCount = 20; //TODO add period count to config
    const [outcomePlannings, setOutcomePlannings] = useDerivedState(
        config,
        setConfig,
        (config) => config.outcomePlannings,
        (config, newOutcomePlannings) => ({...config, outcomePlannings: newOutcomePlannings})
    );

    return <div>
    <h1>{config.name}</h1>
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