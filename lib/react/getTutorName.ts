export function getTutorName(tutor: { firstName: string | null; lastName: string | null; fatherName: string | null; }) {
    return tutor.lastName + " " + (tutor.firstName ? tutor.firstName[0] + "." : "") +
        (tutor.fatherName ? tutor.fatherName[0] + "." : "");
}
