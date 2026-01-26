import type { IPeriodPlanning, ISection } from "../../../types/config";
import { useDerivedArrayState } from "../../../utility/useDerivedArrayState";
import { type StateSetter } from "../../../utility/useDerivedState";
import { ConfigTabs } from "../ConfigTabs";
import { PeriodPlanning } from "./PeriodPlanning";

type PeriodPlanningGroupsProps = {
    plannings: IPeriodPlanning[];
    setPlannings: StateSetter<IPeriodPlanning[]>;
    allSections: ISection[];
};

export function PeriodPlanningGroups({plannings, setPlannings, allSections}: PeriodPlanningGroupsProps) {
    const states = useDerivedArrayState(plannings, setPlannings);
    const addPlanning = () => {
        setPlannings(x => [...x, {
            name: "New section group",
            periods: [],
            sections: []
        }]);
    }
    return <ConfigTabs names={states.map(s => s.get.name)} deletes={states.map(s => s.delete)} onAdd={addPlanning} >
        {
            ...states.map((item, index) => {
                return <PeriodPlanning key={index} planning={item.get} setPlanning={item.set} allSections={allSections} ></PeriodPlanning>
            })
        }
    </ConfigTabs>;
}