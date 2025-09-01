import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Course } from '../models/Course.model';
import { Room } from '../models/Room.model';
import { InstructorRequest } from '../models/Instructor.model';
import { Campuses } from '../models/Campuses.model';
import { School } from '../models/School.model';
import { CampusRooms, RoomsUploadRequest, newRoom } from '../components/rooms/rooms.component';
import { NewSection, SectionsRequestFormat } from '../components/section/section.component';
import { Departement } from '../models/Departement.model';
import { ResetPasswordFormat, UpdateUserActivityFormat } from '../components/admins-creator/admins-creator.component';
import { NewInstructor } from '../components/instructors/instructors.component';
import { NewCourseFormat } from '../components/courses/courses.component';
import { NewExamDatesFormat, SearchFormat, examRoomGenerateFormat } from '../components/exam-schedule/exam-schedule.component';
import { ExamIdRequest, UpdateProctoringFormat } from '../components/exam-schedule/exam-schedule-edit/exam-schedule-edit.component';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl: string = 'https://localhost:7047/api/User/';

  constructor(private http: HttpClient) {}

  //Getters
  getUsers() {
    return this.http.get<any>(`${this.baseUrl}getAdmins`);
  }
  getCampuses(){
    return this.http.get<any>(`${this.baseUrl}GetCampuses`);
  }

  getFullInstructorsData(){
    return this.http.get<any>(`${this.baseUrl}GetFullInstructorsData`);
  }
  
  getRoomsData(){
    return this.http.get<any>(`${this.baseUrl}getRooms`);
  }

  getCourses(){
    return this.http.get<any>(`${this.baseUrl}GetCourses`);
  }

  getSections(){
    return this.http.get<any>(`${this.baseUrl}GetSections`);
  }

  getSchools(){
    return this.http.get<any>(`${this.baseUrl}GetSchools`);
  }

  getDep(){
    return this.http.get<any>(`${this.baseUrl}GetDep`);
  }

  getRoles(){
    return this.http.get<any>(`${this.baseUrl}getRoles`);
  }

  getInst(){
    return this.http.get<any>(`${this.baseUrl}getInst`);
  }

  getExamTypes(){
    return this.http.get<any>(`${this.baseUrl}getExamTypes`)
  }

  getUniqueAcademicyear(){
    return this.http.get<any>(`${this.baseUrl}GetUniqueAcademicYear`)
  }

  getExams(format:SearchFormat){
    return this.http.post<any>(`${this.baseUrl}GetExams`,format)
  }

  getScheduel(format:examRoomGenerateFormat){
    return this.http.post<any>(`${this.baseUrl}getExamsForDownload`,format)
  }

  getInstructorsForProctoring(e:ExamIdRequest){
    return this.http.post<any>(`${this.baseUrl}GetInstructorsForProctoring`,e)
  }

  getExamProctorsSingle(e:ExamIdRequest){
    return this.http.post<any>(`${this.baseUrl}GetProctorsIds`,e);
  }

  //Setter
  setCourses(array:Course[]){
    return this.http.post<any>(`${this.baseUrl}ImportCourses`,array);
  }

  setRooms(request:RoomsUploadRequest){
    return this.http.post<any>(`${this.baseUrl}ImportRooms`,request);
  }

  setInstructors(instructors:InstructorRequest[]){
    return this.http.post<any>(`${this.baseUrl}ImportInstructors`,instructors);
  }

  setCampuses(array:Campuses[]){
    return this.http.post<any>(`${this.baseUrl}ImportCampuses`,array);
  }
  
  setSections(array:SectionsRequestFormat[]){
    return this.http.post<any>(`${this.baseUrl}ImportSections`,array);
  }

  updateCampus(campus:Campuses){
    return this.http.post<any>(`${this.baseUrl}UpdateCampus`,campus);
  }

  updateInstructor(inst:any){
    return this.http.post<any>(`${this.baseUrl}UpdateInstructor`,inst)
  }

  updateRoom(room:any){
    
    return this.http.post<any>(`${this.baseUrl}UpdateRooms`,room)

  }

  createUser(user:any){
    return this.http.post<any>(`${this.baseUrl}CreateUser`,user);
  }

  setnewSchool(school:School){
    return this.http.post<any>(`${this.baseUrl}saveSchool`,school);
  }
  
  setnewDep(dep:Departement){
    return this.http.post<any>(`${this.baseUrl}saveDep`,dep)
  }

  updateUserActivity(format:UpdateUserActivityFormat){
    return this.http.post<any>(`${this.baseUrl}updateUserActivity`,format)
  }

  insertNewInstructor(format:NewInstructor){
    return this.http.post<any>(`${this.baseUrl}InsertInstructorManual`,format);
  }

  resetUserPassword(format:ResetPasswordFormat){
    return this.http.post<any>(`${this.baseUrl}ResetUserPassword`,format)
  }

  newCourse(format:NewCourseFormat){
    return this.http.post<any>(`${this.baseUrl}NewCourse`,format);
  }

  newRoom(format:newRoom){
    return this.http.post<any>(`${this.baseUrl}NewRoom`,format);
  }

  newSection(format:NewSection){
    return this.http.post<any>(`${this.baseUrl}newSection`,format);
  }

  newSectionsExam(format:NewExamDatesFormat){
    return this.http.post<any>(`${this.baseUrl}NewExamDates`,format);
  }

  generateExamRoom(format:examRoomGenerateFormat){
    return this.http.post<any>(`${this.baseUrl}GenerateExamRooms`,format);
  }

  generateProctors(format:examRoomGenerateFormat){
    return this.http.post<any>(`${this.baseUrl}GenerateProctors`,format);
  }

  updateSection(format:any){
    return this.http.post<any>(`${this.baseUrl}UpdateSection`,format);
  }

  updateExamProctors(format:UpdateProctoringFormat){
    return this.http.post<any>(`${this.baseUrl}UpdateExamProctoringSchedule`,format);
  }
}
