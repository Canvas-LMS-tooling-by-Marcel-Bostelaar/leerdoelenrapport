export function NotFound({optionalMessage}: {optionalMessage?: string}) {
    return <div>
        404 - Not Found
        {optionalMessage && <div>{optionalMessage}</div>}
    </div>;
}