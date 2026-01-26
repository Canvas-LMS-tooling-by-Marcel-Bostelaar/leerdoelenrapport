import type { IPeriodPlanning, ISection } from "src/types/config";
import { useDerivedArrayState } from "src/utility/useDerivedArrayState";
import { useDerivedState, type StateSetter } from "src/utility/useDerivedState";
import { ConfigTabs } from "src/components/config/ConfigTabs";
import { PeriodPlanning } from "src/components/config/periodplanning/PeriodPlanning";

type PeriodPlanningGroupsProps = {
    plannings: IPeriodPlanning[];
    setPlannings: StateSetter<IPeriodPlanning[]>;
    allSections: ISection[];
};

export function PeriodPlanningGroups({plannings, setPlannings, allSections}: PeriodPlanningGroupsProps) {
    const states = useDerivedArrayState(plannings, setPlannings);
    const nameStates = states.map(item => {
            const [get, set] = useDerivedState(
                item.get,
                item.set,
                x => x.name,
                (_, newName) => { return { ...item.get, name: newName } }
            )
            return { get, set };
        }
    );
    const addPlanning = () => {
        setPlannings(x => [...x, {
            name: "New section group",
            periods: [],
            sections: []
        }]);
    }
    return <ConfigTabs names={nameStates.map(s => s.get)} setNames={nameStates.map(s => s.set)} deletes={states.map(s => s.delete)} onAdd={addPlanning} >
        {
            ...states.map((item, index) => {
                return <PeriodPlanning key={index} planning={item.get} setPlanning={item.set} allSections={allSections} ></PeriodPlanning>
            })
        }
    </ConfigTabs>;
}