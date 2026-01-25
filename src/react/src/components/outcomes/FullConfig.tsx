import { useState } from "react";
import type { IFullConfig } from "../../types/config";
import { GroupingConfig } from "./GroupingConfig";
import type { IOutcomeGrouping } from "../../types/IOutcomeGrouping";
import { useDerivedState, type StateSetter } from "../../utility/useDerivedState";
import { useDerivedArrayState } from "../../utility/useDerivedArrayState";

type FullConfigProps = {
    config: IFullConfig;
    setConfig: StateSetter<IFullConfig>;
    saveAndReloadConfig: () => void;
    outcomeGrouping: IOutcomeGrouping
};

export function FullConfig({ config, setConfig, saveAndReloadConfig, outcomeGrouping}: FullConfigProps) {
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const [configs, setConfigs] = useDerivedState(
        config,
        setConfig,
        x => x.groupingConfigs,
        (_, newSub) => {return {groupingConfigs: newSub}}
    );
    const configStates = useDerivedArrayState(configs, setConfigs);
    const safeActiveTabIndex = activeTabIndex >= configs.length ? 0 : activeTabIndex;

    const addNewConfig = () => {
        setConfigs(x => [...x, {
            name: "New config",
            outcomePlannings: [],
            periodPlannings: [],
            periodCount: 6
        }]);
        saveAndReloadConfig();
    }

    if (configStates.length <= 0) {
        return <div>No grouping configs available</div>;
    }

    return (
        <>
            {config.groupingConfigs.map((groupingConfig, index) => (
                <button
                    key={index}
                    onClick={() => setActiveTabIndex(index)}
                    style={{ color: safeActiveTabIndex === index ? "green" : "red" }}
                >
                    {groupingConfig.name}
                </button>
            ))}
            <button onClick={addNewConfig}>New+</button>

            <GroupingConfig
                config={configStates[safeActiveTabIndex].get}
                setConfig={configStates[safeActiveTabIndex].set}
                deleteConfig={configStates[safeActiveTabIndex].delete}
                grouping={outcomeGrouping}
            />
        </>
    );
}