import { InstructorRequest } from "./Instructor.model";

export class Departement{
    departementName:string|undefined;
    schoolID:string |undefined;
    instructors:InstructorRequest[]|undefined;
}