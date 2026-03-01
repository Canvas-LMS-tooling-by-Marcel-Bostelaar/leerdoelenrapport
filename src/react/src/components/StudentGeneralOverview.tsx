import { useEffect, useState } from "react";
import type { IFullConfig, IGroupingConfig } from "src/types/config";
import { loadConfig } from "src/utility/apiCalls";
import { TabGroup } from "./TabGroup";
import { StudentSectionOverview } from "./StudentSectionOverview";
import "./StudentGeneralOverview.css";


export function StudentGeneralOverview(){
    //get config
    const [config, setConfig] = useState<IFullConfig | null>(null);
    const aheadBehindPentalty = 0;
    const period = 5;

    useEffect(() => {
        loadConfig(setConfig);
    }, []);

    if(config === null){
        return <div>Loading configuration...</div>;
    }

    return <TabGroup names={config.groupingConfigs.map(x => x.name)}>
        {config.groupingConfigs.map((groupingconfig, index) => (
            <StudentGeneralGroupingOverview 
            key={index}
            groupingconfig={groupingconfig}
            aheadBehindPentalty={aheadBehindPentalty}
            period={period}
            />
        ))}
    </TabGroup>
}

type StudentGeneralGroupingOverviewProps = {
    groupingconfig : IGroupingConfig;
    aheadBehindPentalty: number;
    period: number;
}

function StudentGeneralGroupingOverview({groupingconfig, aheadBehindPentalty, period} : StudentGeneralGroupingOverviewProps){
    const sections = Array.from(new Set(groupingconfig.periodPlannings.flatMap(x => x.sections))).filter(x => !x.isOrphaned);
    return <>
        {sections.map((section, index) => (
            <StudentSectionOverview 
            key={index}
            GroupingConfig={groupingconfig}
            Section={section.section.id}
            SectionName={section.section.name}
            aheadBehindPentalty={aheadBehindPentalty}
            period={period}
            />
        ))}
    </>;
}