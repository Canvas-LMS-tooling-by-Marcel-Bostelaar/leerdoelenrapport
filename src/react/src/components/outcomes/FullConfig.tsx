import { useState } from "react";
import type { IFullConfig } from "../../types/config";
import { GroupingConfig } from "./GroupingConfig";
import type { IOutcomeGrouping } from "../../types/IOutcomeGrouping";
import { useDerivedState, type StateSetter } from "../../utility/useDerivedState";
import { useDerivedArrayState } from "../../utility/useDerivedArrayState";

type FullConfigProps = {
    config: IFullConfig;
    setConfig: StateSetter<IFullConfig>;
    outcomeGrouping: IOutcomeGrouping
};

export function FullConfig({ config, setConfig, outcomeGrouping}: FullConfigProps) {
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const [configs, setConfigs] = useDerivedState(
        config,
        setConfig,
        x => x.groupingConfigs,
        (_, newSub) => {return {groupingConfigs: newSub}}
    );
    const configStates = useDerivedArrayState(configs, setConfigs);

    if (configStates.length === 0) {
        return <div>No grouping configs available</div>;
    }

    return (
        <>
            {config.groupingConfigs.map((groupingConfig, index) => (
                <button
                    key={index}
                    onClick={() => setActiveTabIndex(index)}
                    style={{ color: activeTabIndex === index ? "green" : "red" }}
                >
                    {groupingConfig.name}
                </button>
            ))}

            <GroupingConfig
                config={configStates[activeTabIndex].get}
                setConfig={configStates[activeTabIndex].set}
                grouping={outcomeGrouping}
            />
        </>
    );
}