import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserStoreService } from '../../services/user-store.service';
import { NgToastService } from 'ng-angular-popup';
import { ApiService } from '../../services/api.service';
import { ExcelService } from '../../services/excel.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { MatDialog } from '@angular/material/dialog';
import { SectionEditComponent } from './section-edit/section-edit.component';
import { error } from 'jquery';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrl: './section.component.css'
})
export class SectionComponent implements OnInit {
  @ViewChild('EditModal') EditModal: ModalDirective | undefined;
  dbCampuses:any[]=[];
  dbInstructors:any[]=[];
  dbRooms:any[]=[];
  dbCourses:any[]=[];

  academicYear: string = '';
  selectedSemestre: string = '';

  ExcelSections: any[] = []
  dbSections: any[] | undefined;

  maxRows: number = 10
  currentthreePage: number[] = [1, 2, 3];
  currentPageIndex: number = 1;
  currentPage: Page = new Page(0, this.maxRows);
  tablePages: Page[] = [];

  toastDuration: number = 5000;
  role!: string;


  newSectionCourseId:string|undefined;
  newSectionRoomId:string|undefined;
  newSectionInstructorId:string|undefined;
  m:boolean = false;
  T:boolean = false;
  W:boolean = false;
  Th:boolean = false;
  newSectionStartTime:string|undefined;
  newSectionEndTime:string|undefined;
  newSectionAcademicYear:string|undefined;
  newSectionMaxNumber:string|undefined;
  newSectionSemestre:string|undefined;
  newSectionLetter:string|undefined;

  allowedRoles: string[] = ['SuperAdmin', 'Admin'];

  constructor(private dialog: MatDialog,private auth: AuthService, private userStore: UserStoreService, private toast: NgToastService, private api: ApiService, private excel: ExcelService) {

  }

  ngOnInit(): void {
    this.userStore.getRole()
      .subscribe(val => {
        const roleFromToken = this.auth.getRoleFromToke();
        this.role = val || roleFromToken;
      });

    this.getSections();
    this.getCourses();
    this.getCampuses();
    this.getInstructors();
    this.getRooms();
  }

  readSectionsFromExcel(event: any): void {
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
        var check = this.SectionsFileFormatValidator(data);
        if (!check) {
          this.toast.error({ detail: "ERROR", summary: "Invalid Excel Format For Sections File" });
          const fileInput = event.target as HTMLInputElement;
          fileInput.value = '';
          return;
        }
        this.ExcelSections = data;
        console.log(this.ExcelSections);
        // this.ExcelCourses = data;
      })
    }
  }

  SectionsFileFormatValidator(course: any): boolean {
    var titles: any = course[0];
    var fileTitles: any = ['ID', 'Code', 'Title', 'Section', 'Room', 'NB', 'Schedule', 'Instructor']
    var keys = Object.keys(titles);
    if (keys.length != fileTitles.length) {
      return false;
    }
    for (let k of keys) {
      if (!fileTitles.includes(k)) {
        return false;
      }
    }
    return true
  }

  uploadSections() {
    var sectionsRequestFormat: SectionsRequestFormat[] = this.createRequestFormat();
    console.log(sectionsRequestFormat);
    if (this.academicYear != '' && this.selectedSemestre != '' && sectionsRequestFormat.length != 0) {
      this.api.setSections(sectionsRequestFormat).subscribe({
        next: (value) => {
          console.log("HIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII")
          console.log(value);
          console.log("HIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII")
          this.toast.success({ detail: "Success", summary: "Sections Upload Successfull", duration: this.toastDuration });

          this.getSections();
          /*if (value.unfoundRoom.length == 0 && value.unfoundCourses.length == 0 && value.unfoundInstructors.length == 0) {
            this.getSections();
            this.toast.success({ detail: "Success", summary: "Sections Upload Successfull", duration: this.toastDuration });
          }
          else {
            this.getSections();
          }*/
        },
        error: (err) => {
          console.log(err.message);
          this.toast.error({ detail: "ERROR", summary: "Server Error", duration: this.toastDuration });
          
        }
      })

    }
    else {
      this.toast.error({ detail: "ERROR", summary: "Missing Data", duration: this.toastDuration });
    }
  }


  createRequestFormat(): SectionsRequestFormat[] {
    var sectionsRequestFormat: SectionsRequestFormat[] = [];

    for (let s of this.ExcelSections) {
      var newSection: SectionsRequestFormat = new SectionsRequestFormat();

      newSection.Code = s['Code'];
      newSection.Room = s['Room'];
      newSection.Schedule = s['Schedule'];
      newSection.NB = s['NB'];
      newSection.Title = s['Title'];
      newSection.Instructor = s['Instructor']
      newSection.AcademicYear = this.academicYear;
      newSection.Section = s['Section'];
      newSection.semestre = this.selectedSemestre;
      sectionsRequestFormat.push(newSection);
    }

    sectionsRequestFormat = sectionsRequestFormat.slice(1);
    return sectionsRequestFormat
  }

  getSections() {
    this.api.getSections().subscribe({
      next: (data) => {
        console.log(data);
        this.dbSections = data;
      }
    })
  }

  getCampuses(){
    this.api.getCampuses().subscribe({
      next:(data)=>{
        this.dbCampuses = data;
      },
      error:(err)=>{

      }
    })
  }

  getInstructors(){
    this.api.getInst().subscribe({
      next:(data)=>{
        this.dbInstructors = data;
        console.log(this.dbInstructors);
      }
    })
  }

  getRooms(){
    this.api.getRoomsData().subscribe({
      next:(data)=>{
        this.dbRooms = data;
      }
    })
  }
  
  getCourses(){
    this.api.getCourses().subscribe({
      next:(data)=>{
        this.dbCourses = data;
      }
    })
  }

  onEdit(item:any){
    const dialogRef = this.dialog.open(SectionEditComponent,{
      disableClose: true,
      autoFocus: false,
      enterAnimationDuration: '0.2s',
      data: {
        section: item,
      },
    });

    dialogRef.afterClosed().subscribe(result=>{
      if(result){
        var udpatedSection:any = result;

        this.api.updateSection(udpatedSection).subscribe({
          next:(res)=>{
            this.toast.success({ detail: "Success", summary: "Section Updated successfully", duration: this.toastDuration });
            this.getSections();
          },
          error:(error)=>{
            this.toast.error({ detail: "ERROR", summary: error.error.message, duration: this.toastDuration });
          }
        })
      }
    })
  }

  onSubmit(){
    var newSection:NewSection = new NewSection();
    newSection.courseId = this.newSectionCourseId;
    newSection.instructorId = this.newSectionInstructorId;
    newSection.roomId = this.newSectionRoomId;
    newSection.m = this.m;
    newSection.t = this.T;
    newSection.w = this.W;
    newSection.th = this.Th;
    newSection.academicYear = this.newSectionAcademicYear;
    newSection.startTime = this.newSectionStartTime;
    newSection.endTime =this.newSectionEndTime;
    newSection.sectionLetter = this.newSectionLetter;
    newSection.semestre = this.newSectionSemestre;

    console.log(newSection);
    this.api.newSection(newSection).subscribe({
      next:(res)=>{
        console.log(res);
        this.toast.success({ detail: "Success", summary: "Sections Upload Successfull", duration: this.toastDuration });
      },
      error:(err)=>{
        console.log(err);
        this.toast.error({ detail: "ERROR", summary: "Server Error", duration: this.toastDuration });
      }
    })
  }

  nextPage() {
    this.currentPage = new Page(this.currentPage.min + this.maxRows, this.currentPage.max + this.maxRows);
    this.currentPageIndex += 1;
    if (this.currentthreePage.includes(this.currentPageIndex)) {
      return;
    }
    this.currentthreePage = [this.currentPageIndex, this.currentPageIndex + 1, this.currentPageIndex + 2];
  }

  prevPage() {
    this.currentPage = new Page(this.currentPage.min - this.maxRows, this.currentPage.max - this.maxRows);
    this.currentPageIndex -= 1;
    if (this.currentthreePage.includes(this.currentPageIndex)) {
      return;
    }
    this.currentthreePage = [this.currentPageIndex - 2, this.currentPageIndex - 1, this.currentPageIndex];
  }

  indexedPage(index: number) {
    this.currentPage = this.tablePages[index];
    this.currentPageIndex = index;
  }

  lastPage() {
    this.currentPage = this.tablePages[this.tablePages.length - 1];
    this.currentPageIndex = this.tablePages.length - 1;
    this.currentthreePage = [this.currentPageIndex - 2, this.currentPageIndex - 1, this.currentPageIndex];
  }

  firstPage() {
    this.currentPage = this.tablePages[0];
    this.currentPageIndex = 1;
    this.currentthreePage = [1, 2, 3];
  }
}

export class Page {
  min: number;
  max: number;
  constructor(min: number, max: number) {
    this.min = min;
    this.max = max;
  }
}

export class SectionsRequestFormat {
  ID: number | undefined;
  Code: string | undefined;
  Title: string | undefined;
  Section: string | undefined;
  Room: string | undefined;
  NB: string | undefined;
  Schedule: string | undefined;
  Instructor: string | undefined;
  AcademicYear: string | undefined;
  semestre: string | undefined;
}

export class NewSection{
  courseId:string|undefined;
  instructorId:string|undefined;
  roomId:string|undefined;
  sectionLetter:string|undefined;
  startTime:string|undefined;
  endTime:string|undefined;
  m:boolean|undefined;
  t:boolean|undefined;
  w:boolean|undefined;
  th:boolean|undefined;
  academicYear:string|undefined;
  semestre:string|undefined;
}