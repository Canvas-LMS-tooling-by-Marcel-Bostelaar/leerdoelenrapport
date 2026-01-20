import type { PeriodPlanningData } from './Data';
import OutcomeCell from './OutcomeCell';

interface OutcomeRowProps {
    outcomeName: string;
    outcomeId: number;
    periodCount: number;
    periodData: PeriodPlanningData;
    showIds?: boolean;
}

function OutcomeRow({
    outcomeName,
    outcomeId,
    periodCount,
    periodData,
    showIds = false
}: OutcomeRowProps) {
    return (
        <tr>
            <td>
                {outcomeName}
                {showIds && outcomeId && ` (${outcomeId})`}
            </td>
            <OutcomeCell 
                niveau={0}
            />
            {Array.from({ length: periodCount }, (_, i) => {
                const period = i + 1;
                const data = periodData[period];
                return (
                    <OutcomeCell
                        niveau={data?.niveau ?? 0}
                    />
                );
            })}
        </tr>
    );
}

export default OutcomeRow;