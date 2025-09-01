import { Component, OnInit, ViewChild } from '@angular/core';
import { ExcelService } from '../../services/excel.service';
import { ApiService } from '../../services/api.service';
import { NgToastService } from 'ng-angular-popup';
import { UserStoreService } from '../../services/user-store.service';
import { AuthService } from '../../services/auth.service';
import { School } from '../../models/School.model';
import { Departement } from '../../models/Departement.model';
import { InstructorRequest } from '../../models/Instructor.model';
import { ImportInstructorsRequest, InstructorsCampuses } from '../../models/CampusInstructors.model';
import { Router } from '@angular/router';
import { ActiveLinkServiceService } from '../../services/active-link-service.service';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { InstructorEditComponent } from './instructor-edit/instructor-edit.component'

@Component({
  selector: 'app-instructors',
  templateUrl: './instructors.component.html',
  styleUrl: './instructors.component.css'
})
export class InstructorsComponent implements OnInit {
  ExcelInstructors: any = [];
  dbInstructors: any[] | undefined;
  toastDuration: number = 5000;
  role!: string;
  isCampusData: boolean = false;
  dbCampuses: any[] = [];
  dbSchool: any[] = [];

  allowedRoles: string[] = ['SuperAdmin', 'Admin'];

  selectedCampuses: any[] = []
  selectedSchool: number = 0;
  selectedDepartment: number = 0;

  fname: string | undefined;
  mname: string | undefined;
  lname: string | undefined;
  title: string | undefined;
  email: string | undefined;
  mainCampus: number | undefined;

  maxRows: number = 10
  currentthreePage: number[] = [1, 2, 3];
  currentPageIndex: number = 1;
  currentPage: Page = new Page(0, this.maxRows);
  tablePages: Page[] = [];

  constructor(private dialog: MatDialog, private route: Router, private excel: ExcelService, private api: ApiService, private toast: NgToastService, private userStore: UserStoreService, private auth: AuthService, private activeLink: ActiveLinkServiceService) {
  }

  ngOnInit(): void {
    this.userStore.getRole().subscribe(val => {
      const roleFromToken = this.auth.getRoleFromToke();
      this.role = val || roleFromToken;
    })
    this.getCampuse();
    this.getSchools();
    this.getInstructorsFullData();
  }

  pushNewCampus(campus: any) {
    const index = this.selectedCampuses.indexOf(campus);

    if (index === -1) {
      this.selectedCampuses.push(campus);
    } else {
      this.selectedCampuses.splice(index, 1);
    }
  }

  readInstructors(event: any): void {
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

        var check = this.InstructorsFileFormatValidator(data);

        if (!check) {
          this.toast.error({ detail: "ERROR", summary: "Invalid Excel Format for Instructors.", duration: this.toastDuration });
          const fileInput = event.target as HTMLInputElement;
          fileInput.value = '';
          return;
        }

        this.ExcelInstructors = data;
        this.createAPIData();
      });
    }
  }

  createAPIData(): InstructorRequest[] {
    var instructors: InstructorRequest[] = [];

    for (let i of this.ExcelInstructors) {
      var inst: InstructorRequest = new InstructorRequest();
      inst.fname = i['fname'];
      inst.mname = i['mname'];
      inst.lname = i['lname'];
      inst.email = i['accountEmail'];
      inst.title = i['title'];
      inst.dep = i['Division'];
      inst.school = i['School'];
      inst.campus = i['campus'];

      instructors.push(inst);
    }
    instructors = instructors.slice(1);
    console.log(instructors);
    return instructors;
  }

  InstructorsFileFormatValidator(instructors: any): boolean {
    var titles: any = instructors[0];
    var fileTitles: any = ['facultyId', 'facuser', 'title', 'fname', 'mname', 'lname', 'accountEmail', 'campus', 'School', 'Division'];
    var keys = Object.keys(titles);
    if (keys.length != fileTitles.length) {
      return false
    }

    for (let t of Object.keys(titles)) {
      if (!fileTitles.includes(t)) {
        return false;
      }
    }
    return true
  }

  uploadInstructors() {

    var instructors: InstructorRequest[] = this.createAPIData();

    if (instructors.length == 0) {
      this.toast.error({ detail: "ERROR", summary: "You Need To upload The Instructos Excel File first", duration: this.toastDuration })
      return
    }
    this.api.setInstructors(instructors).subscribe({
      next: (res) => {
        this.getInstructorsFullData();
        console.log(res);
        this.toast.success({ detail: "Succes", summary: "Schools,Departments,Courses uploaded successfully", duration: this.toastDuration })
      },
      error: (err) => {
        this.toast.error({ detail: "ERROR", summary: err.message, duration: this.toastDuration })
      },
    });

  }

  getInstructorsFullData() {
    this.api.getFullInstructorsData().subscribe({
      next: (res) => {
        this.dbInstructors = res;
        var page: number = res.length;
        this.tablePages.push(new Page(0, this.maxRows))
        while (this.tablePages[this.tablePages.length - 1].max < page) {
          this.tablePages.push(new Page(this.tablePages[this.tablePages.length - 1].min + this.maxRows, this.tablePages[this.tablePages.length - 1].max + this.maxRows))
        }
      }
    })
  }

  getSelectedSchoolDepartments(): any[] | undefined {
    console.log(this.selectedSchool);
    for (var s of this.dbSchool) {
      if (s.schoolId == this.selectedSchool) {
        console.log(s.departments);
        return s.departments
      }
    }
    return undefined;
  }


  createAPICampuseInstructors(): InstructorsCampuses[] {
    var campusInstructors: InstructorsCampuses[] = [];
    for (let item of this.ExcelInstructors) {
      var x: InstructorsCampuses = new InstructorsCampuses();
      x.campusName = item.campus;
      x.instEmail = item.accountEmail;
      campusInstructors.push(x);
    }

    campusInstructors = campusInstructors.slice(1);


    return campusInstructors;
  }

  getCampuse() {
    this.api.getCampuses().subscribe({
      next: (res) => {
        this.isCampusData = true;
        this.dbCampuses = res;
      }
    }
    )
  }

  onSubmit() {
    var newInst: NewInstructor = new NewInstructor();
    var campuses: number[] = [];
    for (var c of this.selectedCampuses) {
      campuses.push(c.id);
    }
    newInst.fname = this.fname;
    newInst.mname = this.mname;
    newInst.lname = this.lname;
    newInst.title = this.title;
    newInst.email = this.email;
    newInst.depId = this.selectedDepartment;
    newInst.campuses = campuses;
    newInst.mainCampus = this.mainCampus;
    newInst.schoolId = this.selectedSchool;

    this.api.insertNewInstructor(newInst).subscribe({
      next: (res) => {
        console.log(res)
        this.getInstructorsFullData();
        this.toast.success({ detail: "Success", summary: "New Instructor Uploaded Successfully", duration: this.toastDuration })
      },
      error: (err) => {
        this.toast.error({ detail: "ERROR", summary: "Error While Uploading New Instructor", duration: this.toastDuration });
        console.log(err);
      },
    })
  }

  getSchools() {
    this.api.getSchools().subscribe({
      next: (res) => {
        this.dbSchool = res;
        console.log(res);
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

  onSchoolSelected(schoolName: string) {
    // Find the selected school object from dbSchool array based on the selected schoolName
    this.selectedSchool = this.dbSchool.find(s => s.schoolName === schoolName);
  }

  onEdit(item: any) {
    const dialogref = this.dialog.open(InstructorEditComponent, {
      disableClose: true,
      autoFocus: false,
      enterAnimationDuration: '0.2s',
      data: {
        instructor: item,
      },
    });

    dialogref.afterClosed().subscribe(result => {
      if (result) {

        var updatedInstructor: any = result;

        if (updatedInstructor.fname == '' || updatedInstructor.lname == '' || updatedInstructor.mname == '' || updatedInstructor.Id == null || updatedInstructor.email == '' || updatedInstructor.depId == null) {
          this.toast.error({ detail: "ERROR", summary: "Missing Data To Update Instructor" })
          return;
        }
        else {
          this.api.updateInstructor(updatedInstructor).subscribe({
            next: (res) => {
              this.getInstructorsFullData();
              this.toast.success({ detail: "Success", summary: "Instructor Updated successfully", duration: this.toastDuration });
            },
            error: (error) => {
              this.toast.error({ detail: "ERROR", summary: error.error.message, duration: this.toastDuration });
            }
          })
        }
      }
    })
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

export class NewInstructor {
  fname: string | undefined;
  mname: string | undefined;
  lname: string | undefined;
  title: string | undefined;
  email: string | undefined;
  depId: number | undefined;
  schoolId: number | undefined;

  campuses: any[] | undefined;
  mainCampus: any | undefined;
}