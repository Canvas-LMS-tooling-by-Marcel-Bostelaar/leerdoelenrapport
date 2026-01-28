type PeriodCellReadonlyProps = {
    cssMarkerClasses: string[]
    currentLevel: number;
};

export function PeriodCellReadonly({cssMarkerClasses, currentLevel}: PeriodCellReadonlyProps) {
    
    return <td className="cell">
        Level: {currentLevel}
        {
            cssMarkerClasses.map((x, index) => (
                <Marker key={index} className={x} />
            ))
        }
    </td>;
}

function Marker({className}: {className: string}) {
    return <span className={className}>•</span>;
}