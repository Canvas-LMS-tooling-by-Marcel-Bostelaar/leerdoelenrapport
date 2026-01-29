export type IOutcomeResult = {
    // id: number; //Removed id, as there can be virtual results not from the actual canvas backend.
    score: number;
    learning_outcome_id: number;
    submitted_or_assessed_at: Date;
}

export type IOutcomeResultGroup = {
    assesment_description: string;
    outcome_results: Map<number, IOutcomeResult>;
    date: Date;
}

export type IOutcomeResultSet<T> = {
    total: T;
    generated: T[];
    individual_assessments: T[];
}

export type CssDecoratedIOutcomeResultGroup = IOutcomeResultGroup & {
    cssClass: string;
}