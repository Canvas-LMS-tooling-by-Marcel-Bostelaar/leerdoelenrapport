

export type IOutcomeGrouping = {
    id: number;
    title: string;
    description: string | null;
    child_groups: IOutcomeGrouping[];
    child_outcomes: number[];
}