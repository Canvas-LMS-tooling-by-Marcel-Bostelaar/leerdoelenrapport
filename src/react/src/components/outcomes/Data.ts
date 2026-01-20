

export type PeriodPlanningData = Record<number, { niveau: number }>

export type OutcomePlanningRowData = {
    outcomeName: string;
    outcomeId: number;
    periodData: PeriodPlanningData;
}

export type OutcomeCategoryData = {
    categoryName: string;
    outcomes: OutcomePlanningRowData[];
}


// Results of student

//Individual outcome datapoint
export type OutcomeIndividualDatapoint = {
    result_set: number;
    level: number;
    date: Date;
}

export type OutcomeData = Record<number, Array<OutcomeIndividualDatapoint>>;
