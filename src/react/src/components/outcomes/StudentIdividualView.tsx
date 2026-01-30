import { useParams } from "react-router-dom";
import { NotFound } from "../NotFound";
import { useEffect, useState } from "react";
import type { CssDecoratedIOutcomeResultGroup, IOutcomeResultGroup, IOutcomeResultSet } from "src/types/IOutcomeResult";
import type { IFullConfig, ISection } from "src/types/config";
import { loadConfig, loadOutcomeGrouping, loadStudentResults, loadStudentSections } from "../../utility/apiCalls";
import { useDerivedArrayState } from "src/utility/useDerivedArrayState";
import { useDerivedState, type StateSetter } from "src/utility/useDerivedState";
import { useSpecificCookie } from "src/utility/useSpecificCookie";
import { TabGroup } from "../TabGroup";
import { OutcomeGroupReadonly } from "./OutcomeGroupReadonly";
import type { IOutcomeGrouping } from "src/types/IOutcomeGrouping";


/**
 * Gets student id and name from url params and calls data fetching component
 */
export function StudentIndividualViewRouterChild(){
    const { id } = useParams<{ id: string }>();
    const { name } = useParams<{ name: string }>();
    return id ? <StudentIndividualViewDataFetching studentId={Number(id)} name={name ?? "No name in url"}/> : <NotFound optionalMessage="Student ID not found"/>;
}

export function StudentIndividualView({studentId, name}: {studentId: number, name: string}) {
    return <StudentIndividualViewDataFetching studentId={studentId} name={name}/>;
}

type StudentIndividualViewRenderProps = {
    name: string;
    resultStateObject: IOutcomeResultSet<gettersetter<FullyDecoratedORG>>;
    sections: ISection[];
    config: IFullConfig;
    outcomeGrouping: IOutcomeGrouping;
    studentId: number;
};

type EnabledDecoration<T> = {
    enabled: boolean;
    item: T;
}

type FullyDecoratedORG = EnabledDecoration<CssDecoratedIOutcomeResultGroup>;

function StudentIndividualViewRender({name, resultStateObject, sections, config, outcomeGrouping, studentId}: StudentIndividualViewRenderProps) {
    //Set of ids of sections the student is in
    const knownStudentSectionIds = new Set(sections.map(section => section.id));
    //Filter to only grouping configs where the student is in at least one linked section
    const configsStudentIsIn = config.groupingConfigs.filter(
        groupingConfig => groupingConfig.periodPlannings.some(
            periodPlanning => periodPlanning.sections.some(
                section => knownStudentSectionIds.has(section.section.id)
            )
        )
    )

    const enabledOutcomeResults = [resultStateObject.total, ...resultStateObject.individual_assessments, ...resultStateObject.generated]
    .filter(x => x.get.enabled).map(x => x.get.item);

    return (
        configsStudentIsIn.length === 0 ? <p>Student {name} is not in any sections linked to an outcome planning.</p> : 
        <>
            <TabGroup names={configsStudentIsIn.map(cfg => cfg.name)}>
                {
                    configsStudentIsIn.map((groupingConfig) => (
                        <OutcomeGroupReadonly 
                        key={groupingConfig.name}
                        grouping={outcomeGrouping}
                        outcomeResults={enabledOutcomeResults}
                        studentId={studentId}
                        groupingConfigName={groupingConfig.name}
                        periodCount={groupingConfig.periodCount}
                        outcomePlannings={groupingConfig.outcomePlannings}
                        />
                    ))
                }
            </TabGroup>
        </>
    );
}

type CalculationProps = {
    name: string;
    results: IOutcomeResultSet<IOutcomeResultGroup>;
    sections: ISection[];
    config: IFullConfig;
    outcomeGrouping: IOutcomeGrouping;
    studentId: number;
}

/**
 * Creates togglable state, with cookie saving. Creates state object that it passes to render.
 * @returns 
 */
function StudentIndividualViewStateCalculation({name, results, sections, config, outcomeGrouping, studentId}: CalculationProps){
    //Get previous enabled show/hide from cookies
    const [savedEnables, setSavedEnables] = useSpecificCookie("enabled_outcome_results", () => new Map<string, boolean>(), 
        mapToObject, 
        objectToMap);
    //Create fully decorated result (as changable state).
    const [resultState, setResultState] = useState<IOutcomeResultSet<FullyDecoratedORG>>(() => makeIntoSelectableOutcomeResultSet(results, savedEnables));
    
    //When results change, rebuild result state, using previous enabled toggles.
    useEffect(() => {
        setResultState(old => makeIntoSelectableOutcomeResultSet(results, createEnabledDisabledMap(old)));
    }, [results]);
    //When result state changes, save new toggles to cookies.
    useEffect(() => {
        setSavedEnables(createEnabledDisabledMap(resultState));
    }, [resultState]);

    //Create outcome result set that contains setters for all items, from the previous state.
    const invertedOutcomeState = useInvertedOutcomeStateSet(resultState, setResultState);

    return <StudentIndividualViewRender name={name} resultStateObject={invertedOutcomeState} sections={sections} config={config} outcomeGrouping={outcomeGrouping} studentId={studentId}/>
}

/**
 * Loads data and then calls state calculation component
 */
function StudentIndividualViewDataFetching({studentId, name}: {studentId: number, name: string}) {
    const [results, setResults] = useState<IOutcomeResultSet<IOutcomeResultGroup> | undefined>(undefined);
    const [sections, setSections] = useState<ISection[] | undefined>(undefined);
    const [config, setConfig] = useState<IFullConfig | undefined>(undefined);
    const [outcomeGrouping, setOutcomeGrouping] = useState<IOutcomeGrouping | undefined>(undefined);
    // const [progressScores, setProgressScores] = useState<IProgressScore[] | undefined>(undefined);

    const allLoaded = results !== undefined && sections !== undefined && config !== undefined && outcomeGrouping !== undefined;

    useEffect(() => {
        loadConfig(setConfig)
        .then(() => loadOutcomeGrouping(setOutcomeGrouping));
    }, []);

    useEffect(() => {
        loadStudentResults(studentId, setResults)
        .then(() => loadStudentSections(studentId, setSections));
    }, [studentId]);

    return (<>
        {
        allLoaded ?
        <StudentIndividualViewStateCalculation name={name} results={results} sections={sections} config={config} outcomeGrouping={outcomeGrouping} studentId={studentId}/>
         : <p>Loading...</p>}
    </>);
}


function makeCssClassFromString(input: string): string {
    return input.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

function makeIntoSelectableOutcomeResultSet(results: IOutcomeResultSet<IOutcomeResultGroup>, knownEnables: Map<string, boolean>): IOutcomeResultSet<FullyDecoratedORG> {
    return {
        total: 
        {
            enabled: knownEnables.get("total") || true,
            item: {
                ...results.total,
                cssClass: 'total-result'
            }
        },
        generated: results.generated.map(group => ({
            enabled: knownEnables.get(group.assesment_description) || true,
            item: {
                ...group,
                cssClass: 'generated-result-' + makeCssClassFromString(group.assesment_description)
            }
        })),
        individual_assessments: results.individual_assessments.map(group => ({
            enabled: knownEnables.get(group.assesment_description) || true,
            item: {
                ...group,
                cssClass: 'individual-assessment-result-' + makeCssClassFromString(group.assesment_description)
            }
        }))
    };
}

type gettersetter<T> = {
    get: T;
    set: StateSetter<T>;
}

function useInvertedOutcomeStateSet(get: IOutcomeResultSet<FullyDecoratedORG>, set: StateSetter<IOutcomeResultSet<FullyDecoratedORG>>) : IOutcomeResultSet<gettersetter<FullyDecoratedORG>> {
    const [totalGet, totalSet] = useDerivedState(
        get, set,
        x => x.total,
        (original, newItem) => {
            return {
                ...original,
                total: newItem
            };
        }
    );

    const [generatedGet, generatedSet] = useDerivedState(
        get, set,
        x => x.generated,
        (original, newItem) => {
            return {
                ...original,
                generated: newItem
            };
        }
    );
    const [individualGet, individualSet] = useDerivedState(
        get, set,
        x => x.individual_assessments,
        (original, newItem) => {
            return {
                ...original,
                individual_assessments: newItem
            };
        }
    );

    const generatedArraySetters = useDerivedArrayState(generatedGet, generatedSet);
    const individualArraySetters = useDerivedArrayState(individualGet, individualSet);

    return {
        total: {get: totalGet, set: totalSet},
        generated: generatedArraySetters.map(item => ({get: item.get, set: item.set})),
        individual_assessments: individualArraySetters.map(item => ({get: item.get, set: item.set}))
    };
}

function createEnabledDisabledMap(set: IOutcomeResultSet<FullyDecoratedORG>): Map<string, boolean> {
    const map = new Map<string, boolean>();
    map.set('total', set.total.enabled);
    set.generated.forEach(group => {
        map.set(group.item.assesment_description, group.enabled);
    });
    set.individual_assessments.forEach(group => {
        map.set(group.item.assesment_description, group.enabled);
    });
    return map;
}


function objectToMap(obj: object): Map<string, boolean> {
    const map = new Map<string, boolean>();
    for (const [key, value] of Object.entries(obj)) {
        map.set(key, Boolean(value));
    }
    return map;
}

function mapToObject(map: Map<string, boolean>): object {
    const obj: any = {};
    for (const [key, value] of map.entries()) {
        obj[key] = value;
    }
    return obj;
}