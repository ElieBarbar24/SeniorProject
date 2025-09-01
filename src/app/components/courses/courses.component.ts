import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserStoreService } from '../../services/user-store.service';
import { NgToastService } from 'ng-angular-popup';
import { ApiService } from '../../services/api.service';
import { ExcelService } from '../../services/excel.service';
import { Course } from '../../models/Course.model';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent implements OnInit{
  dbCourses:any[]|undefined;
  dbDep:any[]|undefined;
  ExcelCourses:any[] = [];

  toastDuration:number = 5000;
  role!:string;
  allowedRoles:string[] = ['SuperAdmin','Admin'];

  courseCode:string = '';
  courseTitle:string='';
  courseCredits:string = '';
  coursesLevel:string = '';
  coursePre:string = '';
  courseCore:string = '';
  courseDep:string = '';

  maxRows:number = 10
  currentthreePage:number[] = [0,1,2];
  currentPageIndex:number = 0;
  currentPage:Page = new Page(0,this.maxRows);
  tablePages:Page[] =[];
  constructor(private auth:AuthService,private userStore:UserStoreService,private toast:NgToastService,private api:ApiService,private excel:ExcelService){

  }

  ngOnInit(): void {
      this.userStore.getRole()
      .subscribe(val=>{
        const roleFromToken = this.auth.getRoleFromToke();
        this.role = val||roleFromToken;
      });
      this.getCourses();
      this.getDep();
  }

  readCoursesFromExcel(event:any):void{
    const file = event.target.files[0];

    if(file){
      const validExtensions = ['.xls', '.xlsx'];
      const fileName = file.name.toLowerCase();
      const isValidExtension = validExtensions.some(ext => fileName.endsWith(ext));

      if (!isValidExtension) {
        this.toast.error({ detail: "ERROR", summary: "Invalid file type. Please select an Excel file.", duration: this.toastDuration });
        const fileInput = event.target as HTMLInputElement;
        fileInput.value = '';
        return;
      }

      this.excel.excelToArray(file).then((data)=>{
        var check = this.CourseFileFormatValidator(data);
        if(!check){
          this.toast.error({detail:"ERROR",summary:"Invalid Excel Format For Courses File"});
          const fileInput = event.target as HTMLInputElement;
          fileInput.value = '';
          return;
        }

        this.ExcelCourses = data;
      })
    }
  }

  CourseFileFormatValidator(course: any): boolean {
    var titles: any = course[0];
    var fileTitles: any = ['#', 'Code', 'Title', 'Credits', 'Level', 'Capcity', 'School', 'Pre-requisites', 'Co-requisites']
    var keys = Object.keys(titles);
    if(keys.length !=fileTitles.length){
      return false;
    }
    for (let k of keys) {
      if (!fileTitles.includes(k)) {
        return false;
      }
    }
    return true
  }

  createAPICourses(): Course[] {
    var newCourses: Course[] = [];
    for (let course of this.ExcelCourses) {
      var newCourse: Course = new Course();
      newCourse.Code = course['Code'];
      newCourse.Title = course['Title'];
      newCourse.Credits = course['Credits'];
      newCourse.Level = course['Level']
      newCourse.Corequisites = course['Co-requisites'];
      newCourse.Prerequisites = course['Pre-requisites'];
      newCourses.push(newCourse);
    }
    console.log(newCourses);
    newCourses = newCourses.slice(1);
    return newCourses;
  }

  uploadCourses(){
    var courses:Course[] = this.createAPICourses();
    if(courses.length==0){
      this.toast.error({detail:"ERROR",summary:"You Need To upload The Courses Excel File first",duration:this.toastDuration})
        return;
    }
    this.api.setCourses(courses).subscribe({
      next:(value)=>{
        this.getCourses();
        this.toast.success({detail:"Success",summary:"Courses Uploading Successfuly",duration:this.toastDuration});
      },
      error:(err)=>{
        console.log(err.message);
        this.toast.error({detail:"ERROR",summary:"Server Error",duration:this.toastDuration});
      }

    })
  }

  getCourses(){
    this.api.getCourses().subscribe({
      next:(data)=>{
        this.dbCourses = data;
        var page:number = this.dbCourses!.length;
        this.tablePages.push(new Page(0,this.maxRows))
        while(this.tablePages[this.tablePages.length-1].max<page){
          this.tablePages.push(new Page(this.tablePages[this.tablePages.length-1].min+this.maxRows,this.tablePages[this.tablePages.length-1].max+this.maxRows))
        }
      }
    })
  }

  getDep(){
    this.api.getDep().subscribe({
      next:(data)=>{
        this.dbDep = data;
        console.log(this.dbDep)
      }
    })
  }

  onSubmit(){
    var newCourse:NewCourseFormat = new NewCourseFormat();
    newCourse.courseCode = this.courseCode;
    newCourse.courseCore = this.courseCore;
    newCourse.courseCredit = this.courseCredits;
    newCourse.courseDep = this.courseDep;
    newCourse.coursePre = this.coursePre;
    newCourse.courseTitle = this.courseTitle;
    newCourse.courseLevel = this.coursesLevel;
    
    this.api.newCourse(newCourse).subscribe({
      next:(res)=>{
        this.toast.success({detail:"Success",summary:"New Courses Created Successfuly",duration:this.toastDuration});
      },
      error:(err)=>{
        console.log(err);
        this.toast.error({detail:"ERROR",summary:"Server Error",duration:this.toastDuration});
      }
    })
  }

  nextPage(){
    this.currentPage = new Page(this.currentPage.min+this.maxRows,this.currentPage.max+this.maxRows);
    this.currentPageIndex +=1;
    if(this.currentthreePage.includes(this.currentPageIndex)){
      return;
    }
    this.currentthreePage = [this.currentPageIndex,this.currentPageIndex+1,this.currentPageIndex+2];
  }

  prevPage(){
    this.currentPage = new Page(this.currentPage.min-this.maxRows,this.currentPage.max-this.maxRows);
    this.currentPageIndex -=1;
    if(this.currentthreePage.includes(this.currentPageIndex)){
      return;
    }
    this.currentthreePage = [this.currentPageIndex-2,this.currentPageIndex-1,this.currentPageIndex];
  }

  indexedPage(index:number){
    this.currentPage = this.tablePages[index];
    this.currentPageIndex = index;
  }

  lastPage(){
    this.currentPage = this.tablePages[this.tablePages.length-1];
    this.currentPageIndex = this.tablePages.length-1;
    this.currentthreePage = [this.currentPageIndex-2,this.currentPageIndex-1,this.currentPageIndex];
  }

  firstPage(){
    this.currentPage = this.tablePages[0];
    this.currentPageIndex = 0;
    this.currentthreePage = [0,1,2];
  }
}

export class Page{
  min:number;
  max:number;
  constructor(min:number,max:number){
    this.min = min;
    this.max = max;
  }
}

export class  NewCourseFormat{
  courseCode:string|undefined;
  courseCredit:string|undefined;
  courseTitle:string|undefined;
  courseLevel:string|undefined;
  coursePre:string|undefined;
  courseCore:string|undefined;
  courseDep:string|undefined;
}