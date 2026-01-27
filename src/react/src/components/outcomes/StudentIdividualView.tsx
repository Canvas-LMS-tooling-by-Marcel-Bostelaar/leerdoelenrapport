import { useParams } from "react-router-dom";
import { NotFound } from "../NotFound";
import { useState } from "react";
import type { IOutcomeResultSet } from "src/types/IOutcomeResult";


export function StudentIndividualView({studentId}: {studentId: number) {
    const [results, setResults] = useState<IOutcomeResultSet | undefined>(undefined);

    const fetchResults = () => {
        fetch(`/api/students/${studentId}/outcomes`)
            .then(response => response.json())
            .then(data => setResults(data as IOutcomeResultSet));
    }

    return <div>
        <h1>{name}</h1>
    </div>;
}


export function StudentIndividualViewRouterChild(){
    const { id } = useParams<{ id: string }>();
    return id ? <StudentIndividualView studentId={Number(id)} /> : <NotFound optionalMessage="Student ID not found"/>;
}