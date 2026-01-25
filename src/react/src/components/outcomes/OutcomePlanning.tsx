import { Popover } from "@base-ui/react";
import type { IOutcomePlanning, IOutcomePlanningStatus } from "../../types/config";
import { useDerivedState, type StateSetter } from "../../utility/useDerivedState";
import { PeriodCell } from "./PeriodCell";
import "./OutcomePlanning.css";

type OutcomePlanningProps = {
    planning: IOutcomePlanning;
    setPlanning: StateSetter<IOutcomePlanning>;
    periodCount: number;
    deletePlanning: () => void;
};

export function OutcomePlanning({planning, setPlanning, periodCount, deletePlanning}: OutcomePlanningProps) {
    const levelChangeHandler = (old : number) => old + 1; //TODO get real one from context, so context can determine if it should count up, to how much, or change to a specific one directly.
    const [status, setStatus] = useDerivedState(
        planning,
        setPlanning,
        plan => plan.status,
        (plan, newStatus) => {return {...plan, status: newStatus}}
    );
    
    const periodData = 
        Array.from({length: periodCount}).map((_, index) => {
            const currentLevel = planning.periodLevels.get(index) || 0;
            const onLevelChangeCommand = () => setPlanning(
                old => {
                    let periodLevels = new Map(old.periodLevels);
                    periodLevels.set(index, levelChangeHandler(currentLevel));
                    return {
                        ...old,
                        periodLevels: periodLevels
                    }
                }
            );
            return {
                currentLevel: currentLevel,
                onLevelChangeCommand: onLevelChangeCommand
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
                onLevelChangeCommand={period.onLevelChangeCommand}
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
                            currentState == "orphaned" ? <p onClick={() => {
                                if (AreYouSureDelete()) {
                                    deletePlanning();
                                }
                            }}>Delete</p> : <></>
                        }
                    </div>
                </Popover.Popup>
            </Popover.Positioner>
        </Popover.Portal>
    </Popover.Root>
    );
}

function AreYouSureDelete() : boolean{
    return confirm("Are you sure you want to delete this orphaned outcome from this configuration? This action cannot be undone.");
}