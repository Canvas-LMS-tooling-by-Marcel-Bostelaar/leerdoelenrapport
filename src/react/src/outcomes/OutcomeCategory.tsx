import type { OutcomePlanningRowData } from './Data';
import OutcomeRow from './OutcomeRow';

type OutcomeCategoryProps = {
    categoryName: string;
    outcomes: OutcomePlanningRowData[];
    periodCount: number;
    showIds?: boolean;
}

function OutcomeCategory({
    categoryName,
    outcomes,
    periodCount,
    showIds = false
}: OutcomeCategoryProps) {
    return (
        <>
            <tr>
                <th colSpan={periodCount + 2}>{categoryName}</th>
            </tr>
            {outcomes.length > 0 && (
                <tr>
                    <th>Leerdoel</th>
                    <th></th>
                    {Array.from({ length: periodCount }, (_, i) => (
                        <th key={i + 1}>Periode {i + 1}</th>
                    ))}
                </tr>
            )}
            {outcomes.map((outcome, idx) => (
                <OutcomeRow
                    key={idx}
                    outcomeName={outcome.outcomeName}
                    outcomeId={outcome.outcomeId}
                    periodCount={periodCount}
                    periodData={outcome.periodData}
                    showIds={showIds}
                />
            ))}
        </>
    );
}

export default OutcomeCategory;
