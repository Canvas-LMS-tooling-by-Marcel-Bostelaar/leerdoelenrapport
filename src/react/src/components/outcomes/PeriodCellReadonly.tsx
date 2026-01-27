import type { CssDecoratedIOutcomeResultGroup } from "src/types/IOutcomeResult";

type PeriodCellReadonlyProps = {
    outcomeID: number;
    currentLevel: number;
    outcomeResults: CssDecoratedIOutcomeResultGroup[];
};

export function PeriodCellReadonly({outcomeID, currentLevel, outcomeResults}: PeriodCellReadonlyProps) {
    const relevantOutcomes = outcomeResults
    .filter(x => {
        if(!x.outcome_results.has(outcomeID)){
            return false;
        }
        return x.outcome_results.get(outcomeID)!.score === currentLevel;
    })
    .map(x => x.cssClass);
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