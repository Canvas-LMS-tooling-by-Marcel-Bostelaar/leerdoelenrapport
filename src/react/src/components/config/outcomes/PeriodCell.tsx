
type PeriodCellProps = {
    currentLevel: number;
    onCellClick: () => void;
    onCellRightClick: () => void;
};

export function PeriodCell({currentLevel, onCellClick, onCellRightClick}: PeriodCellProps) {
    return <td className="cell">
        <button onClick={onCellClick} onContextMenu={(e) => { e.preventDefault(); onCellRightClick(); }}>
            Level: {currentLevel}
        </button>
    </td>;
}