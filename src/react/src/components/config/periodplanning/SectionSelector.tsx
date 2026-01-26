import type { IDecoratedSection, ISection } from "src/types/config";
import { useDerivedArrayState } from "src/utility/useDerivedArrayState";
import { useDerivedState, type StateSetter } from "src/utility/useDerivedState";


type SectionSelectorProps = {
    activeSections: IDecoratedSection[];
    setActiveSections: StateSetter<IDecoratedSection[]>;
    allSections: ISection[];
};

type selectWrapper = {
    selected: boolean;
    wrapped: IDecoratedSection;
}

export function SectionSelector({activeSections, setActiveSections, allSections}: SectionSelectorProps) {
    //Take all inactive sections, map them to unseleted decorated sections
    const inactiveSections = allSections.filter(section => 
        !activeSections.some(active => active.section.id === section.id)
    ).map(section => {
        return {
            selected: false,
            wrapped: {
                isOrphaned: false,
                section: section
            }
        };
    });

    //Combine both lists. If any data changes, the list will be set to only the selected sections.
    const [sections, setSections] = useDerivedState<IDecoratedSection[], selectWrapper[]>(
        activeSections,
        setActiveSections,
        x => 
            x.map(section => {
                return {
                    selected: true,
                    wrapped: section
                };
            }).concat(inactiveSections)
            .sort((a, b) => b.wrapped.section.name.localeCompare(a.wrapped.section.name)),
        (_, newItem) => {
            return newItem.filter(item => item.selected).map(item => item.wrapped);
        }
    );
    return <SectionSelectorInternal sections={sections} setSections={setSections} />;
}

type SectionSelectorInternalProps = {
    sections: {
        selected: boolean;
        wrapped: IDecoratedSection;
    }[];
    setSections: StateSetter<{
        selected: boolean;
        wrapped: IDecoratedSection;
    }[]>;
}

function SectionSelectorInternal({sections, setSections}: SectionSelectorInternalProps) {
    const arraySetters = useDerivedArrayState(sections, setSections)
    .map(item => {
        if(item.get.wrapped.isOrphaned){
            return item;
        }
        return {
            ...item,
            delete: () => {}//Cant delete non-orphaned sections
        }
    })
    return <div>
        <h3>Sections</h3>
        {arraySetters.map((item, index) => <SectionItem key={index} section={item.get} setSection={item.set} deleteSection={item.delete} />)}
    </div>
}

type SectionItemProps = {
    section: selectWrapper;
    setSection: StateSetter<selectWrapper>;
    deleteSection: () => void;
};

function SectionItem({section, setSection, deleteSection}: SectionItemProps){
    return <div>
        <label>
            <input type="checkbox" checked={section.selected} onChange={(e) => {
                setSection({...section, selected: e.target.checked});
            }} />
            {section.wrapped.section.name} {section.wrapped.isOrphaned ? "(Orphaned)" : ""}
        </label>
        {section.wrapped.isOrphaned && <button onClick={deleteSection}>Delete</button>}
    </div>;
}