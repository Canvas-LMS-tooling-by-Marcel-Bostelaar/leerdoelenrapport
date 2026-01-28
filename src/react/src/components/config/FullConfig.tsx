import { type IGroupingConfig, type IFullConfig, type ISection } from "src/types/config";
import { GroupingConfig } from "src/components/config/GroupingConfig";
import type { IOutcomeGrouping } from "src/types/IOutcomeGrouping";
import { useDerivedState, type StateSetter } from "src/utility/useDerivedState";
import { useDerivedArrayState } from "src/utility/useDerivedArrayState";
import { ConfigTabs } from "src/components/config/ConfigTabs";

type FullConfigProps = {
    config: IFullConfig;
    setConfig: StateSetter<IFullConfig>;
    revalidateConfig: () => void;
    outcomeGrouping: IOutcomeGrouping
    allSections: ISection[];
};

export function FullConfig({ config, setConfig, revalidateConfig, outcomeGrouping, allSections}: FullConfigProps) {
    const [configs, setConfigs] = useDerivedState<IFullConfig, IGroupingConfig[]>(config, setConfig,"groupingConfigs");
    const configStates = useDerivedArrayState(configs, setConfigs);
    const configNames = configStates.map(item => {
        const [get, set] = useDerivedState<IGroupingConfig, string>(item.get,item.set,"name");
        return { get, set };
    });

    const addNewConfig = () => {
        setConfigs(x => [...x, {
            name: "New config",
            outcomePlannings: [],
            periodPlannings: [],
            periodCount: 6
        }]);
        revalidateConfig();
    }

    return (<>
            <ConfigTabs names={configNames.map(c => c.get)} setNames={configNames.map(c => c.set)} deletes={configStates.map(s => s.delete)} onAdd={addNewConfig} >
                {
                    ...configStates.map(
                        (item, index) => {
                            return <GroupingConfig
                                key={index}
                                config={item.get}
                                setConfig={item.set}
                                grouping={outcomeGrouping}
                                allSections={allSections}
                            />
                        }
                    )
                }
            </ConfigTabs>
        </>
    );
}