import type { OutcomeCategoryData } from './Data';
import OutcomeCategory from './OutcomeCategory';

interface OutcomeTableProps {
    categories: Array<OutcomeCategoryData>;
    periodCount: number;
    showIds?: boolean;
}

function OutcomeTable({
    categories,
    periodCount,
    showIds = false
}: OutcomeTableProps) {
    return (
        <table className="outcome-table">
            <tbody>
                {categories.map((category, idx) => (
                    <OutcomeCategory
                        key={idx}
                        categoryName={category.categoryName}
                        outcomes={category.outcomes}
                        periodCount={periodCount}
                        showIds={showIds}
                    />
                ))}
            </tbody>
        </table>
    );
}

export default OutcomeTable;
