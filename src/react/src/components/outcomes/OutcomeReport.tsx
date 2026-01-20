import OutcomeTable from './OutcomeTable';
import type { OutcomeCategoryData } from './Data';

interface OutcomeReportProps {
    studentName: string;
    categories: Array<OutcomeCategoryData>;
    periodCount: number;
    showIds: boolean;
}

function OutcomeReport({
    studentName,
    categories,
    periodCount = 12,
    showIds = false
}: OutcomeReportProps) {
    return (
        <>
            <h1>{studentName}</h1>
            <OutcomeTable
                categories={categories}
                periodCount={periodCount}
                showIds={showIds}
            />
        </>
    );
}

export default OutcomeReport;
