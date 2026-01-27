export type IOutcomeResult = {
    id: number;
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