import { useState, type ReactElement } from "react";
import { AreYouSureDelete } from "src/utility/prompt";

type ConfigTabsProps = {
    names: string[];
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
export function ConfigTabs({ names, deletes, children, onAdd }: ConfigTabsProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const onSelect = (index: number) => {
        setActiveIndex(index);
    };
    if(children.length !== names.length) {
        throw new Error("ConfigTabs: name count must match children count");
    }
    if(deletes && deletes.length !== children.length) {
        throw new Error("ConfigTabs: deletes count must match children count");
    }
    const safeIndex = activeIndex >= children.length ? 0 : activeIndex;
    return (
        <div>
            <div>
                {names.map((name, index) => (
                    <button
                        key={index}
                        onClick={() => onSelect(index)}
                        style={{ color: activeIndex === index ? "green" : "red" }}
                    >
                        {name}
                        {deletes && deletes[index] && <button onClick={_ => AreYouSureDelete(deletes[index])}>🗑️</button>}
                    </button>
                ))}
                <button onClick={onAdd}>New+</button>
            </div>
            {children[safeIndex]}
        </div>
    );
}
