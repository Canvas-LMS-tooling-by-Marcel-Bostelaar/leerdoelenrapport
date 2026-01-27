import { useEffect, useState } from "react";

type Student = {
    id: number;
    name: string;
}

export function StudentOverview() {
    const [students, setStudents] = useState<Student[]>([]);
    useEffect(() => {
        fetch('/api/students')
            .then(response => response.json())
            .then(data => setStudents(data as Student[]));
    }, []);
    return <div>
        Student Overview<br />

        {
            students.map(student => (<>
                <a key={student.id} href={`/students/${student.id}/${encodeURIComponent(student.name)}`}>{student.name}</a>
                <br />
                </>
            ))
        }
    </div>;
}