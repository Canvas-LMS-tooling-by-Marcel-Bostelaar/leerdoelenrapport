type cssAndScore = {
    css: string;
    score: number;
}

type PeriodCellReadonlyProps = {
    cssMarkerClasses: cssAndScore[]
    currentLevel: number;
};

export function PeriodCellReadonly({cssMarkerClasses, currentLevel}: PeriodCellReadonlyProps) {
    
    return <td className="cell">
        {currentLevel}
        {
            cssMarkerClasses.map((x, index) => (
                <Marker key={index} className={x.css} actualScore={x.score} />
            ))
        }
    </td>;
}

function Marker({className, actualScore}: {className: string, actualScore: number}) {
    return <span className={className + " marker"}>({actualScore})</span>;
}