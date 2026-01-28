import { Popover } from "@base-ui/react";
import type { IOutcomePlanning, IOutcomePlanningStatus } from "src/types/config";
import { useDerivedState, type StateSetter } from "src/utility/useDerivedState";
import { PeriodCell } from "src/components/config/outcomes/PeriodCell";
import "src/components/config/outcomes/OutcomePlanning.css";
import { AreYouSureDelete } from "src/utility/prompt";

type OutcomePlanningProps = {
    planning: IOutcomePlanning;
    setPlanning: StateSetter<IOutcomePlanning>;
    periodCount: number;
    deletePlanning: () => void;
};

export function OutcomePlanning({planning, setPlanning, periodCount, deletePlanning}: OutcomePlanningProps) {
    const levelChangeHandler = (old : number) => old + 1; //TODO get real one from context, so context can determine if it should count up, to how much, or change to a specific one directly.
    const levelReverseHandler = (old : number) => Math.max(0, old - 1); //TODO get real one from context, so context can determine if it should count up, to how much, or change to a specific one directly.
    const [status, setStatus] = useDerivedState<IOutcomePlanning, IOutcomePlanningStatus>(planning,setPlanning,"status");
    
    const periodData = 
        Array.from({length: periodCount}).map((_, index) => {
            const currentLevel = planning.periodLevels.get(index) || 0;
            const onLeftClick = () => setPlanning(
                old => {
                    let periodLevels = new Map(old.periodLevels);
                    periodLevels.set(index, levelChangeHandler(currentLevel));
                    return {
                        ...old,
                        periodLevels: periodLevels
                    }
                }
            );
            const onRightClick = () => setPlanning(
                old => {
                    let periodLevels = new Map(old.periodLevels);
                    periodLevels.set(index, levelReverseHandler(currentLevel));
                    return {
                        ...old,
                        periodLevels: periodLevels
                    }
                }
            );
            return {
                currentLevel: currentLevel,
                onCellClick: onLeftClick,
                onCellRightClick: onRightClick
            }
        });

    return <>
    <tr>
        <td className="cell">
            <PopoverStateSelector currentState={status} setState={setStatus} deletePlanning={deletePlanning}></PopoverStateSelector>
            {planning.outcome.title}
        </td>
        {periodData.map((period, index) => (
            <PeriodCell 
                key={index}
                currentLevel={period.currentLevel}
                onCellClick={period.onCellClick}
                onCellRightClick={period.onCellRightClick}
            />
        ))}
    </tr>
    </>
}

type PopoverStateSelectorProps = {
    currentState: IOutcomePlanningStatus;
    setState: StateSetter<IOutcomePlanningStatus>;
    deletePlanning: () => void;
};

function PopoverStateSelector({currentState, setState, deletePlanning}: PopoverStateSelectorProps) {
    return (
    <Popover.Root>
        <Popover.Trigger>
            <span>State: {currentState}</span>
        </Popover.Trigger>
        <Popover.Portal>
            <Popover.Positioner sideOffset={8}>
                <Popover.Popup>
                    <div className="state_popup">
                        <p onClick={() => setState("enabled")}>Enable</p>
                        <p onClick={() => setState("enabled_uncounted")}>Enable, do not count</p>
                        <p onClick={() => setState("disabled")}>Disable</p>
                        {
                            currentState == "orphaned" ? <p onClick={() => AreYouSureDelete(deletePlanning)}>Delete</p> : <></>
                        }
                    </div>
                </Popover.Popup>
            </Popover.Positioner>
        </Popover.Portal>
    </Popover.Root>
    );
}

