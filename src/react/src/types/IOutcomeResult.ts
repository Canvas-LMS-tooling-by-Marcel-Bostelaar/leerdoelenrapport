export type IOutcomeResult = {
    id: number;
    score: number;
    learning_outcome_id: number;
    submitted_or_assessed_at: Date;
}

export type IOutcomeResultGroup = {
    assesment_description: string;
    css_class: string;
    outcome_results: Map<number, IOutcomeResult>;
    date: Date;
}

export type IOutcomeResultSet = {
    total: IOutcomeResultGroup;
    generated: IOutcomeResultGroup[];
    individual_assesments: IOutcomeResultGroup[];
}