import { useState, type ReactElement } from "react";
import { AreYouSureDelete } from "src/utility/prompt";
import type { StateSetter } from "src/utility/useDerivedState";
import "src/components/config/ConfigTabs.css";

type ConfigTabsProps = {
    names: string[];
    setNames: StateSetter<string>[];
    children: ReactElement[];
    deletes?: (() => void)[];
    onAdd: () => void;
};

/**
 * A tab component for configuration sections.
 * 
 * @param children ReactElement[] - The child elements to display, must match the number and order of names
 * @param names string[] - The names of the tabs, must match the number and order of children
 * @param onAdd () => void - Callback function to add a new item in the source data
 * @returns 
 */
export function ConfigTabs({ names, setNames, deletes, children, onAdd }: ConfigTabsProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const onSelect = (index: number) => {
        setActiveIndex(index);
    };
    if(children.length !== names.length) {
        throw new Error("ConfigTabs: name count must match children count");
    }
    if(names.length !== setNames.length) {
        throw new Error("ConfigTabs: setNames count must match names count");
    }
    if(deletes && deletes.length !== children.length) {
        throw new Error("ConfigTabs: deletes count must match children count");
    }
    const safeIndex = activeIndex >= children.length ? 0 : activeIndex;
    return (
        <div>
            <div>
                {names.map((name, index) => (
                    index === safeIndex
                    ? (<ActiveTab key={index} name={name} setName={setNames[index]} delete={deletes ? deletes[index] : undefined} />)
                    : (<InactiveTab key={index} name={name} onClick={() => onSelect(index)} />)
                ))}
                <div onClick={onAdd} className="tabLabel tabNew">New+</div>
            </div>
            {children[safeIndex]}
        </div>
    );
}

function InactiveTab({name, onClick}: {name: string, onClick: () => void}) {
    return (
        <div onClick={onClick} className="tabLabel tabInactive">
            {name}
        </div>
    );
}

type ActiveTabProps = {
    name: string;
    setName: StateSetter<string>;
    delete?: () => void;
};
function ActiveTab({name, setName, delete: onDelete}: ActiveTabProps) {
    return (
        <div className="tabLabel tabSelected" >
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            {onDelete && <button onClick={_ => AreYouSureDelete(onDelete)}>🗑️</button>}
        </div>
    );
}