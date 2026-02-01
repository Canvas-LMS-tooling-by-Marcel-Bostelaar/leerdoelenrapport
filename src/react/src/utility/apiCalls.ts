import { FullConfigToJson, ParseFullConfigJson, type IFullConfig, type ISection } from "src/types/config";
import type { IOutcomeGrouping } from "src/types/IOutcomeGrouping";
import type { IOutcomeResult, IOutcomeResultGroup, IOutcomeResultSet } from "src/types/IOutcomeResult";
import type { IProgressScore } from "src/types/IProgressScore";
import type { StateSetter } from "./useDerivedState";

const configUrl = "/api/config";
const outcomeUrl = "/api/outcomegroups"
const revalidateUrl = "/api/config/revalidate";
const sectionUrl = "/api/sections";


export async function loadConfig(setter: (val: IFullConfig) => void) {
    const response = await fetch(configUrl)
    const json = await response.text()
    setter(ParseFullConfigJson(json));
}

export async function saveConfig(config: IFullConfig | undefined) {
    if(config !== undefined){
        await fetch(configUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: FullConfigToJson(config),
        })
    }
}

export async function loadOutcomeGrouping(setter: (val: IOutcomeGrouping) => void) {
    const response = await fetch(outcomeUrl)
    const json = await response.text()
    setter(JSON.parse(json) as IOutcomeGrouping);
}

export async function revalidateConfig(config: IFullConfig, setter: (val: IFullConfig) => void) {
    let response = await fetch(revalidateUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: FullConfigToJson(config),
    });
    const json = await response.text()
    setter(ParseFullConfigJson(json));
}

export async function loadSections(setter: (val: ISection[]) => void) {
    const response = await fetch(sectionUrl)
    const json = await response.text()
    const parsed = JSON.parse(json) as ISection[];
    setter(parsed);
}

export async function loadStudentResults(studentId: number, setter: (val: IOutcomeResultSet<IOutcomeResultGroup>) => void) {
    const response = await fetch(`/api/students/${studentId}/outcomes`)
    const json = await response.text()
    const parsed = JSON.parse(json, (key, value) => {
        if((key === 'date' || key === 'submitted_or_assessed_at') && typeof value === 'string'){
            return new Date(value);
        }
        if(key === 'outcome_results' && value !== null){
            const map = new Map<number, IOutcomeResult>();
            for(const k in value){
                const outcomeResult = value[k];
                map.set(Number(k), outcomeResult)
            }
            return map;
        }
        return value;
    }) as IOutcomeResultSet<IOutcomeResultGroup>;
    setter(parsed);
}

export async function loadStudentSections(studentId: number, setter: (val: ISection[]) => void) {
    const response = await fetch(`/api/students/${studentId}/sections`)
    const json = await response.text()
    const parsed = JSON.parse(json) as ISection[];
    setter(parsed);
}

export async function loadProgressScores(studentId: number, groupingConfigName: string, aheadBehindPenalty: number, period: number, setter: (val: IProgressScore[]) => void) {
    const response = await fetch(`/api/students/${studentId}/progressscores?grouping=${encodeURIComponent(groupingConfigName)}&aheadBehindPeriodPentalty=${encodeURIComponent(aheadBehindPenalty.toString())}&period=${encodeURIComponent(period.toString())}`, {})
    const json = await response.text();
    const parsed = JSON.parse(json, (key, value) => {
        if(key === 'last_graded_at' && typeof value === 'string'){
            return new Date(value);
        }
        return value;
    }) as IProgressScore[];
    setter(parsed);
}

export type Student = {
    id: number;
    name: string;
}
export async function loadStudents(setter: StateSetter<Student[]>) {
    const response = await fetch('/api/students')
    const json = await response.text()
    const parsed = JSON.parse(json) as Student[];
    setter(parsed);
}

export async function loadStudentsInSection(sectionId: number, setter: StateSetter<Student[]>) {
    const response = await fetch(`/api/sections/${sectionId}/students`)
    const json = await response.text()
    const parsed = JSON.parse(json) as Student[];
    setter(parsed);
}

export async function loadStudentsInMultipleSections(sectionIds: number[], setter: StateSetter<Student[]>[]) {
    for(let i = 0; i < sectionIds.length; i++){
        const sectionId = sectionIds[i];
        const response = await fetch(`/api/sections/${sectionId}/students`)
        const json = await response.text()
        const parsed = JSON.parse(json) as Student[];
        setter[i](parsed);
    }
}