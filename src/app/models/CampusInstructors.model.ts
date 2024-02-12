import { School } from "./School.model";

export class ImportInstructorsRequest {
    Schools: School[] | undefined;
    Campuses: InstructorsCampuses[] | undefined;
}

export class InstructorsCampuses {
    instEmail: string | undefined;
    campusName: string | undefined;
}
