import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Course } from '../models/Course.model';
import { Room } from '../models/Room.model';
import { Instructor } from '../models/Instructor.model';
import { Campuses } from '../models/Campuses.model';
import { School } from '../models/School.model';
import { ImportInstructorsRequest } from '../models/CampusInstructors.model';
import { CampusRooms, RoomsUploadRequest } from '../components/rooms/rooms.component';
import { SectionsRequestFormat } from '../components/section/section.component';

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

  //Setter
  setCourses(array:Course[]){
    return this.http.post<any>(`${this.baseUrl}ImportCourses`,array);
  }

  setRooms(request:RoomsUploadRequest){
    return this.http.post<any>(`${this.baseUrl}ImportRooms`,request);
  }

  setInstructors(instructors:Instructor[]){
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

  createUser(user:any){
    return this.http.post<any>(`${this.baseUrl}CreateUser`,user)
  }
}
