
type PeriodCellProps = {
    currentLevel: number;
    onLevelChangeCommand: () => void;
};

export function PeriodCell({currentLevel, onLevelChangeCommand}: PeriodCellProps) {
    return <td>
        <button onClick={onLevelChangeCommand}>
            Level: {currentLevel}
        </button>
    </td>;
}