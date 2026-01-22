export interface FullConfig{
    groupingConfigs: GroupingConfig[];
}

export interface GroupingConfig {
    name: string;
    outcomePlannings: OutcomePlanning[];
    periodPlannings: PeriodPlanning[];
}

export interface OutcomePlanning {
    outcome: Outcome;
    status: "enabled" | "disabled" | "orphaned";
    periodLevels: Map<number, number>; //cast via parser
}

export interface Outcome {
    id: string;
    url: string;
    domain: string;
    title: string;
    description: string;
    points_possible: number;
    mastery_points: number;
    calculation_method: string;
    calculation_int: number|null;
}

export interface PeriodPlanning {
    periods: Period[];
    sections: DecoratedSection[];
}

export interface DecoratedSection {
    section: Section;
    isOrphaned: boolean;
}

export interface Section {
    id: string;
    course_id: string;
    domain: string;
    name: string;
}

export interface Period {
    startDate: Date; // Cast via parser
    endDate: Date; // Cast via parser
    periodNumber: number;
}


export function ParseFullConfigJson(jsonString: string): FullConfig {
    let config = JSON.parse(jsonString, (key, value) => {
        if (key === 'startDate' || key === 'endDate') {
            return new Date(value);
        }
        if (key === 'periodLevels' && typeof value === 'object' && !Array.isArray(value)) {
            return new Map(Object.entries(value).map(([k, v]) => [Number(k), v]));
        }
        return value;
    });
    return config as FullConfig;
}

export function FullConfigToJson(config: FullConfig): string {
    return JSON.stringify(config, (key, value) => {
        if (key === 'startDate' || key === 'endDate') {
            return (value as Date).toISOString();
        }
        if (key === 'periodLevels' && value instanceof Map) {
            return Object.fromEntries(value);
        }
        return value;
    });
}








