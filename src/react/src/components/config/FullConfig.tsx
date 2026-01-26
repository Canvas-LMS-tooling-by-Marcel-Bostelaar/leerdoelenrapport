import type { IFullConfig, ISection } from "../../types/config";
import { GroupingConfig } from "./GroupingConfig";
import type { IOutcomeGrouping } from "../../types/IOutcomeGrouping";
import { useDerivedState, type StateSetter } from "../../utility/useDerivedState";
import { useDerivedArrayState } from "../../utility/useDerivedArrayState";
import { ConfigTabs } from "./ConfigTabs";

type FullConfigProps = {
    config: IFullConfig;
    setConfig: StateSetter<IFullConfig>;
    revalidateConfig: () => void;
    outcomeGrouping: IOutcomeGrouping
    allSections: ISection[];
};

export function FullConfig({ config, setConfig, revalidateConfig, outcomeGrouping, allSections}: FullConfigProps) {
    const [configs, setConfigs] = useDerivedState(
        config,
        setConfig,
        x => x.groupingConfigs,
        (_, newSub) => {return {groupingConfigs: newSub}}
    );
    const configStates = useDerivedArrayState(configs, setConfigs);

    const addNewConfig = () => {
        setConfigs(x => [...x, {
            name: "New config",
            outcomePlannings: [],
            periodPlannings: [],
            periodCount: 6
        }]);
        revalidateConfig();
    }

    return (
        <ConfigTabs names={configs.map(c => c.name)} onAdd={addNewConfig} >
            {
                ...configStates.map(
                    (item, index) => {
                        return <GroupingConfig
                            key={index}
                            config={item.get}
                            setConfig={item.set}
                            deleteConfig={item.delete}
                            grouping={outcomeGrouping}
                            allSections={allSections}
                        />
                    }
                )
            }
        </ConfigTabs>
    );
}