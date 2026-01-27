import type { IOutcomeResultGroup } from "src/types/IOutcomeResult";

type PeriodCellReadonlyProps = {
    outcomeID: number;
    currentLevel: number;
    outcomeResults: IOutcomeResultGroup[];
};

export function PeriodCellReadonly({outcomeID, currentLevel, outcomeResults}: PeriodCellReadonlyProps) {
    const relevantOutcomes = outcomeResults
    .filter(x => {
        if(!x.outcome_results.has(outcomeID)){
            return false;
        }
        return x.outcome_results.get(outcomeID)!.score === currentLevel;
    })
    .map(x => x.css_class);
    return <td className="cell">
        Level: {currentLevel}
        {
            relevantOutcomes.map((cssClass, index) => (
                <Marker key={index} className={cssClass} />
            ))
        }
    </td>;
}

function Marker({className}: {className: string}) {
    return <span className={className}>•</span>;
}