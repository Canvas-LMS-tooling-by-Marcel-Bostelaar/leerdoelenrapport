
type PeriodCellProps = {
    currentLevel: number;
    onLevelChangeCommand: () => void;
};

export function PeriodCell({currentLevel, onLevelChangeCommand}: PeriodCellProps) {
    return <td className="cell">
        <button onClick={onLevelChangeCommand}>
            Level: {currentLevel}
        </button>
    </td>;
}