import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Course } from '../../models/Course.model';
import { ExcelService } from '../../services/excel.service';
import { NgToastService } from 'ng-angular-popup';
import { Room } from '../../models/Room.model';

@Component({
  selector: 'app-exam-scheduler',
  templateUrl: './exam-scheduler.component.html',
  styleUrl: './exam-scheduler.component.css'
})
export class ExamSchedulerComponent {
  Courses: any[] = [];
  Rooms: any[] = [];
  Instructors: any[] = [];
  toastDuration: number = 2500;


  constructor(private api: ApiService, private excel: ExcelService, private toast: NgToastService) { }


  createAPICourses(courses: any): Course[] {
    var newCourses: Course[] = [];
    for (let course of courses) {
      var newCourse: Course = new Course();

      newCourse.code = course['Code'];
      newCourse.title = course['Title'];
      newCourse.credits = course['Credits'];
      newCourse.coreRequesites = course['Co-requisites'];
      newCourse.preRequesites = course['Pre-requisites'];
      newCourse.school = course['School'];
      console.log(newCourse);
      newCourses.push(newCourse);
    }
    return newCourses;
  }

  createAPIRooms(rooms:any):Room[]{
    var newRooms:Room[] = [];
    for(let room of rooms){
      var newRoom:Room = new Room();

      newRoom.roomNum = room['roomNum']
    }
    return newRooms;
  }

  updateToDatabase() {
    var newCourses: Course[] = this.createAPICourses(this.Courses);
    newCourses = newCourses.slice(1);

    this.api.setClasses(newCourses).subscribe({
      next: (res) => {
        this.toast.success({ detail: "Succes", summary: "Courses uploaded successfully", duration: this.toastDuration })
      },
      error: (err) => {
        this.toast.error({ detail: "ERROR", summary: "Error occured during uploading Courses", duration: this.toastDuration })
      },
    });
  }
  //Read Courses File
  readCourses(event: any): void {
    const file = event.target.files[0];

    if (file) {

      const validExtensions = ['.xls', '.xlsx'];
      const fileName = file.name.toLowerCase();
      const isValidExtension = validExtensions.some(ext => fileName.endsWith(ext));

      if (!isValidExtension) {
        this.toast.error({ detail: "ERROR", summary: "Invalid file type. Please select an Excel file.", duration: this.toastDuration });
        const fileInput = event.target as HTMLInputElement;
        fileInput.value = '';
        return;
      }
      this.excel.excelToArray(file).then((data) => {

        var check: boolean = this.CourseFileFormatValidator(data);

        if (!check) {
          this.toast.error({ detail: "ERROR", summary: "Invalid Excel Format for Courses.", duration: this.toastDuration });
          const fileInput = event.target as HTMLInputElement;
          fileInput.value = '';
          return;
        }

        this.Courses = data;

      }).catch((error) => {
        console.error('Error reading Excel file:', error);
      });
    }
  }


  //Validate The Course File Format
  CourseFileFormatValidator(course: any): boolean {
    var titles: any = course[0];
    var fileTitles: any = ['#', 'Code', 'Title', 'Credits', 'Level', 'Capcity', 'School', 'Pre-requisites', 'Co-requisites']
    for (let t of Object.keys(titles)) {
      if (!fileTitles.includes(t)) {
        return false;
      }
    }
    return true
  }

  //Read Rooms File Format
  readRooms(event: any): void {
    const file = event.target.files[0];

    if (file) {
      const validExtensions = ['.xls', '.xlsx'];
      const fileName = file.name.toLowerCase();
      const isValidExtension = validExtensions.some(ext => fileName.endsWith(ext));

      if (!isValidExtension) {
        this.toast.error({ detail: "ERROR", summary: "Invalid file type. Please select an Excel file.", duration: this.toastDuration });
        const fileInput = event.target as HTMLInputElement;
        fileInput.value = '';
        return;
      }
      this.excel.excelToArray(file).then((data) => {
        var check: boolean = this.RoomsFileFormatValidator(data);
        if (!check) {
          this.toast.error({ detail: "ERROR", summary: "Invalid Excel Format for Rooms.", duration: this.toastDuration });
          const fileInput = event.target as HTMLInputElement;
          fileInput.value = '';
          return;
        }
        this.Rooms = data;

        console.log(this.Rooms[1]);

      }).catch((error) => {
        console.error('Error reading Excel file:', error);
      });
    }
  }
  //Validate Rooms File Format
  RoomsFileFormatValidator(rooms: any): boolean {
    var titles: any = rooms[0];
    var fileTitles: any = ['roomId', 'roomNum', 'max', 'room Limit in the exam', 'roomNote', 'roomBlock', 'campus', 'Room Type']
    for (let t of Object.keys(titles)) {
      if (!fileTitles.includes(t)) {
        return false;
      }
    }
    return true
  }

  //Read Instructors File
  readInstructors(event: any): void {
    const file = event.target.file[0];

    if (file) {
      const validExtensions = ['.xls', '.xlsx'];
      const fileName = file.name.toLowerCase();
      const isValidExtension = validExtensions.some(ext => fileName.endsWith(ext));

      if (!isValidExtension) {
        this.toast.error({ detail: "ERROR", summary: "Invalid file type. Please select an Excel file.", duration: this.toastDuration });
        const fileInput = event.target as HTMLInputElement;
        fileInput.value = '';
        return;
      }
      this.excel.excelToArray(file).then((data) => {

        var check: boolean = this.InstructorsFileFormatValidator(data);
        if (!check) {
          this.toast.error({ detail: "ERROR", summary: "Invalid Excel Format for Instructors.", duration: this.toastDuration });
          const fileInput = event.target as HTMLInputElement;
          fileInput.value = '';
          return;
        }
        this.Instructors = data;

      }).catch((error) => {
        console.error('Error reading Excel file:', error);
      });

    }
  }
  //Validate Instructors File Format 
  InstructorsFileFormatValidator(rooms: any): boolean {
    var titles: any = rooms[0];
    var fileTitles: any = ['facultyId','facuser','title','fname','mname','lname','accountEmail','campus','school','Division']
    for (let t of Object.keys(titles)) {
      if (!fileTitles.includes(t)) {
        return false;
      }
    }
    return true
  }

}

