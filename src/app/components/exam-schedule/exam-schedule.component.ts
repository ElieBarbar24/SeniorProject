import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ExcelService } from '../../services/excel.service';
import { ApiService } from '../../services/api.service';
import { NgToastService } from 'ng-angular-popup';
import { UserStoreService } from '../../services/user-store.service';
import { AuthService } from '../../services/auth.service';
import { ActiveLinkServiceService } from '../../services/active-link-service.service';
import { Pagination } from '../../models/Pagination.model';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ExamScheduleEditComponent } from './exam-schedule-edit/exam-schedule-edit.component';

@Component({
  selector: 'app-exam-schedule',
  templateUrl: './exam-schedule.component.html',
  styleUrl: './exam-schedule.component.css'
})
export class ExamScheduleComponent implements OnInit {
  @ViewChild('GenerateProctorsConfirmation') generateProctorsConfirmation: ModalDirective | undefined;
  @ViewChild('GenerateExamRoomConfirmation') generateExamRoomConfirmation: ModalDirective | undefined;

  allowedRoles: string[] = ['SuperAdmin', 'Admin'];
  
  ExcelSectionsExams: any = [];
  newExamsType: string = '';
  newExmasSemestre: string = '';
  newExamsAcademicYear: string = '';
  newExamsCampus: string = '';
  dbExams: any[] = [];
  dbCampuses: any[] = [];
  examsPages: Pagination = new Pagination();


  searchByExamType: string = '';
  searchBySemestre: string = '';
  searchByAcademicYear: string = '';
  searchByCampus: string = '';

  ExamType: string = '';
  Semestre: string = '';
  AcademicYear: string = '';
  Campus: string = '';

  UniqueAcademicYear: any[] = [];

  toastDuration: number = 5000;
  ExamTypes: any[] = [];
  role: string = '';


  constructor(private dialog: MatDialog, private route: Router, private excel: ExcelService, private api: ApiService, private toast: NgToastService, private userStore: UserStoreService, private auth: AuthService, private activeLink: ActiveLinkServiceService) {
  }

  ngOnInit(): void {
    this.userStore.getRole().subscribe(val => {
      const roleFromToken = this.auth.getRoleFromToke();
      this.role = val || roleFromToken;
    })
    this.getExamTypes();
    this.getUniqueAcademicYear();
    this.onchange();
    this.getCampuse();
  }

  readExamsDates(event: any): void {
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
        console.log(data);
        var check = this.examsFileFormatCheck(data);
        if (!check) {
          this.toast.error({ detail: "ERROR", summary: "Invalid Excel Format for Exams Dates.", duration: this.toastDuration });
          const fileInput = event.target as HTMLInputElement;
          fileInput.value = '';
          return;
        }

        this.ExcelSectionsExams = data;
        console.log(this.ExcelSectionsExams);
      });
      


    }
  }

  examsFileFormatCheck(exams: any): boolean {
    var titles: any = exams[0];
    var fileTitles: any = ['Code', 'Course', 'Sec.', 'Instructor', 'Final Exam Time', 'Final  Exam Room', '# STD', 'School', 'Campus', 'Final Exam Date'];
    var keys = Object.keys(titles);
    console.log(keys.length)
    console.log(fileTitles.length);
    if (keys.length != fileTitles.length) {
      return false
    }

    for (let t of Object.keys(titles)) {
      if (!fileTitles.includes(t)) {
        console.log(t);
        console.log(false)
        return false;
      }
    }
    return true
  }
  getExamTypes() {
    this.api.getExamTypes().subscribe({
      next: (data) => {
        this.ExamTypes = data;

      }
    })
  }

  getUniqueAcademicYear() {
    this.api.getUniqueAcademicyear().subscribe({
      next: (data) => {
        this.UniqueAcademicYear = data;
      }
    })
  }

  getCampuse() {
    this.api.getCampuses().subscribe({
      next: (res) => {
        this.dbCampuses = res;
        console.log(this.dbCampuses);
      }
    }
    )
  }

  onSubmit() {
    var exams: examDates[] = [];
    this.ExcelSectionsExams = this.ExcelSectionsExams.slice(1);
    for (let e of this.ExcelSectionsExams) {
      var exam: examDates = new examDates();
      exam.code = e.Code;
      exam.sec = e['Sec.'];
      exam.finalExamDate = e['Final Exam Date'];
      exam.finalExamTime = e['Final Exam Time'];

      exams.push(exam);
    }

    var examsFormat: NewExamDatesFormat = new NewExamDatesFormat();

    examsFormat.academicYear = this.newExamsAcademicYear;
    examsFormat.semestre = this.newExmasSemestre;
    examsFormat.examType = this.newExamsType;
    examsFormat.dates = exams;
    examsFormat.examsCampus = this.newExamsCampus;

    console.log(examsFormat);
    this.api.newSectionsExam(examsFormat).subscribe({
      next: (res) => {
        console.log(res);
        this.toast.success({ detail: "Succes", summary: "Section Exams uploaded successfully", duration: this.toastDuration });
        this.getUniqueAcademicYear();
        this.onchange();
      },
      error: (err) => {
        console.log(err);
        this.toast.error({ detail: "ERROR", summary: err.message, duration: this.toastDuration })
      },
    })
  }
  onchange() {
    var format: SearchFormat = new SearchFormat();
    format.searchByAcademicYear = this.searchByAcademicYear;
    format.searchByExamType = this.searchByExamType;
    format.searchBySemestre = this.searchBySemestre;
    format.searchByCampus = this.searchByCampus;
    this.api.getExams(format).subscribe({
      next: (data) => {
        this.dbExams = data;
        console.log(data);
        if (this.dbExams.length !== 0) {
          this.examsPages.genPages(this.dbExams?.length);
        }
      }
    })
  }

  onDownload() {
    if(this.AcademicYear==''||this.Semestre==''||this.ExamType==''||this.Campus==''){
      this.toast.error({ detail: "ERROR", summary: "You Need To Precise the Semester,Academic Year, ExamType,Campus", duration: this.toastDuration })
      return;
    }
    var data: any = [];
    var format: examRoomGenerateFormat = new examRoomGenerateFormat();
    format.AcademicYear = this.AcademicYear;
    format.Semestre = this.Semestre;
    format.ExamType = this.ExamType;
    format.Campus = this.Campus;

    this.api.getScheduel(format).subscribe({
      next: (d) => {
        console.log(d);
        this.excel.arrayToExcel(d,"Scheduel")
      }
    })
  }

  generateExamRooms() {
    if(this.AcademicYear==''||this.Semestre==''||this.ExamType==''||this.Campus==''){
      this.toast.error({ detail: "ERROR", summary: "You Need To Precise the Semester,Academic Year, ExamType,Campus", duration: this.toastDuration })
      return;
    }
    var format: examRoomGenerateFormat = new examRoomGenerateFormat();

    format.AcademicYear = this.AcademicYear;
    format.Semestre = this.Semestre;
    format.ExamType = this.ExamType;
    format.Campus = this.Campus;

    this.api.generateExamRoom(format).subscribe({
      next: (res) => {
        console.log(res);
        this.toast.success({ detail: "Succes", summary: "Exams Rooms generated successfully", duration: this.toastDuration })
        this.onchange();

      },
      error: (err) => {
        console.log(err);
        this.toast.error({ detail: "ERROR", summary: err.message, duration: this.toastDuration })

      }
    })

    if (this.generateExamRoomConfirmation) {
      this.generateExamRoomConfirmation.hide();
    }
  }

  generateProctors() {
    if(this.AcademicYear==''||this.Semestre==''||this.ExamType==''||this.Campus==''){
      this.toast.error({ detail: "ERROR", summary: "You Need To Precise the Semester,Academic Year, ExamType,Campus", duration: this.toastDuration })
      return;
    }
    var format: examRoomGenerateFormat = new examRoomGenerateFormat();

    format.AcademicYear = this.AcademicYear;
    format.Semestre = this.Semestre;
    format.ExamType = this.ExamType;
    format.Campus = this.Campus;

    this.api.generateProctors(format).subscribe({
      next: (res) => {
        console.log(res);
        this.toast.success({ detail: "Succes", summary: "Exams Proctors generated successfully", duration: this.toastDuration })
        this.onchange();

      },
      error: (err) => {
        console.log(err);
        this.toast.error({ detail: "ERROR", summary: err.message, duration: this.toastDuration })

      }
    })

    if (this.generateProctorsConfirmation) {
      this.generateProctorsConfirmation.hide();
    }
  }

  onGenerateProctors() {
    if (this.generateProctorsConfirmation) {
      this.generateProctorsConfirmation.show();
    }
  }

  onGenerateRooms() {
    if (this.generateExamRoomConfirmation) {
      this.generateExamRoomConfirmation.show();
    }
  }

  onEdit(item:any){
    const dialogref = this.dialog.open(ExamScheduleEditComponent,{
      disableClose: true,
      autoFocus: false,
      enterAnimationDuration: '0.2s',
      data: {
        exam: item,
      },
    })
    
    dialogref.afterClosed().subscribe(result=>{
      if(result){
        this.api.updateExamProctors(result).subscribe({
          next:(res)=>{
            this.toast.success({ detail: "Success", summary: "Proctors Updated successfully", duration: this.toastDuration });
            this.onchange();

          },
          error:(err)=>{
            console.log(err);
            this.toast.error({ detail: "ERROR", summary: err.error.message, duration: this.toastDuration });
          }
        })
      }
    })
  }

}




export class examDates {
  code: string | undefined;
  sec: string | undefined;
  finalExamTime: string | undefined;
  finalExamDate: string | undefined;
}

export class NewExamDatesFormat {
  semestre: string | undefined;
  academicYear: string | undefined;
  examType: string | undefined;
  examsCampus: string | undefined;
  dates: examDates[] | undefined;
}

export class SearchFormat {
  searchByExamType: string | undefined;
  searchBySemestre: string | undefined;
  searchByAcademicYear: string | undefined;
  searchByCampus: string | undefined;
}

export class examRoomGenerateFormat {
  ExamType: string | undefined;
  Semestre: string | undefined;
  AcademicYear: string | undefined;
  Campus: string | undefined;
}