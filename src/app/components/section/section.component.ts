import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserStoreService } from '../../services/user-store.service';
import { NgToastService } from 'ng-angular-popup';
import { ApiService } from '../../services/api.service';
import { ExcelService } from '../../services/excel.service';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrl: './section.component.css'
})
export class SectionComponent implements OnInit {
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

  allowedRoles:string[] = ['SuperAdmin','Admin'];

  constructor(private auth: AuthService, private userStore: UserStoreService, private toast: NgToastService, private api: ApiService, private excel: ExcelService) {

  }

  ngOnInit(): void {
    this.userStore.getRole()
      .subscribe(val => {
        const roleFromToken = this.auth.getRoleFromToke();
        this.role = val || roleFromToken;
      });

    this.getSections();
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
          console.log(value);
          this.getSections();
          if(value.unfoundRoom.length==0&&value.unfoundCourses.length==0&&value.unfoundInstructors.length==0){
            this.toast.success({ detail: "Success", summary: "Sections Upload Successfull", duration: this.toastDuration });
          }
          else{

          }
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
        this.dbSections = data;
        console.log(this.dbSections);
        var page: number = this.dbSections!.length;
        this.tablePages.push(new Page(0, this.maxRows))
        while (this.tablePages[this.tablePages.length - 1].max < page) {
          this.tablePages.push(new Page(this.tablePages[this.tablePages.length - 1].min + this.maxRows, this.tablePages[this.tablePages.length - 1].max + this.maxRows))
        }
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