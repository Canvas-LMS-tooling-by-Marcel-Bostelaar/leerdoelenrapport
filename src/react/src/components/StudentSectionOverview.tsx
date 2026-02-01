import { useEffect, useState } from "react";
import { useDerivedArrayState } from "src/utility/useDerivedArrayState";
import { StudentSummary } from "./StudentSummary";
import { loadStudentsInSection, type Student } from "src/utility/apiCalls";
import type { IGroupingConfig } from "src/types/config";
import { useDerivedState } from "src/utility/useDerivedState";

type StudentSectionOverviewProps = {
    GroupingConfig: IGroupingConfig;
    Section: number;
    SectionName: string;
    aheadBehindPentalty: number;
    period: number;
}

export function StudentSectionOverview({GroupingConfig, Section, SectionName, aheadBehindPentalty, period}: StudentSectionOverviewProps){
    const [startLoadingStudents, setStartLoadingStudents] = useState<boolean>(false);
    const [students, setStudents] = useState<Student[]>([]);
    const [decoratedStudents, setDecoratedStudents] = useDerivedState(students, setStudents,
        (students) => students.map(student => ({...student, isLoaded: false})),
        (decoratedStudents) => decoratedStudents.map(decoratedStudent => ({id: decoratedStudent.id, name: decoratedStudent.name}))
    );
    
    const derivedStudents = useDerivedArrayState(decoratedStudents, setDecoratedStudents);

    useEffect(() => {
        loadStudentsInSection(Section, setStudents)
        .then(() => setStartLoadingStudents(true));
    }, []);

    if (students.length === 0) {
        return <div>Loading students...</div>;
    }
    
    return <div>
        {SectionName}<br />
        <table className="studentOverviewTable">
        {
            derivedStudents.map((student, index) => {
                // const shouldLoad = index === 0 ? startLoadingStudents : derivedStudents[index - 1].get.isLoaded;
                return (
                    <StudentSummary 
                    key={index}
                    loadData={true}
                    signalDoneLoading={() => {
                        console.log("Student loaded:", student.get.name);
                        student.set(x => {return {...x, isLoaded: true}})
                    }} 
                    studentID={student.get.id} 
                    studentName={student.get.name} 
                    configGroupName={GroupingConfig.name} 
                    aheadBehindPentalty={aheadBehindPentalty} 
                    period={period} 
                    outcomePlannings={GroupingConfig.outcomePlannings}/>
                );
            })
        }
        </table>
    </div>;
}