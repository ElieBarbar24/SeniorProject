import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Course } from '../models/Course.model';
import { Room } from '../models/Room.model';
import { Instructor } from '../models/Instructor.model';
import { Campuses } from '../models/Campuses.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl: string = 'https://localhost:7047/api/User/';
  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get<any>(`${this.baseUrl}getAdmins`);
  }

  setClasses(array:Course[]){
    return this.http.post<any>(`${this.baseUrl}ImportClasses`,array);
  }

  setRooms(array:Room[]){
    return this.http.post<any>(`${this.baseUrl}ImportRooms`,array);
  }

  setInstructors(array:Instructor[]){
    return this.http.post<any>(`${this.baseUrl}ImportInstructors`,array);
  }

  getCampuses(){
    return this.http.get<any>(`${this.baseUrl}GetCampuses`);
  }

  setCampuses(array:Campuses[]){
    return this.http.post<any>(`${this.baseUrl}ImportCampusesExcel`,array);
  }
}
