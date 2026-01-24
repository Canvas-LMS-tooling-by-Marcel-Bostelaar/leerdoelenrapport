export interface IFullConfig{
    groupingConfigs: IGroupingConfig[];
}

export interface IGroupingConfig {
    name: string;
    outcomePlannings: IOutcomePlanning[];
    periodPlannings: IPeriodPlanning[];
}

export interface IOutcomePlanning {
    outcome: IOutcome;
    status: IOutcomePlanningStatus;
    periodLevels: Map<number, number>; //cast via parser
}

export type IOutcomePlanningStatus =
    "enabled"
    | "disabled"
    | "orphaned"
    | "enabled_uncounted";

export interface IOutcome {
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

export interface IPeriodPlanning {
    periods: IPeriod[];
    sections: IDecoratedSection[];
}

export interface IDecoratedSection {
    section: ISection;
    isOrphaned: boolean;
}

export interface ISection {
    id: string;
    course_id: string;
    domain: string;
    name: string;
}

export interface IPeriod {
    startDate: Date; // Cast via parser
    endDate: Date; // Cast via parser
    periodNumber: number;
}


export function ParseFullConfigJson(jsonString: string): IFullConfig {
    let config = JSON.parse(jsonString, (key, value) => {
        if (key === 'startDate' || key === 'endDate') {
            return new Date(value);
        }
        if (key === 'periodLevels' && typeof value === 'object' && !Array.isArray(value)) {
            return new Map(Object.entries(value).map(([k, v]) => [Number(k), v]));
        }
        return value;
    });
    return config as IFullConfig;
}

export function FullConfigToJson(config: IFullConfig): string {
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








