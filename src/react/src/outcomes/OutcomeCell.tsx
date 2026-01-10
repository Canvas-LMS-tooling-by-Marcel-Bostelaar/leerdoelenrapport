interface OutcomeCellProps {
    niveau: number;
}

function OutcomeCell({ niveau }: OutcomeCellProps) {
    return (
        <td>
            {niveau}
        </td>
    );
}

export default OutcomeCell;