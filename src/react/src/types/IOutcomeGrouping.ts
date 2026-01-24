

export type IOutcomeGrouping = {
    id: string;
    title: string;
    description: string | null;
    child_groups: IOutcomeGrouping[];
    child_outcomes: number[];
}