import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Pagination } from '../../models/Pagination.model';
import { UserStoreService } from '../../services/user-store.service';
import { AuthService } from '../../services/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { School } from '../../models/School.model';

@Component({
  selector: 'app-schools',
  templateUrl: './schools.component.html',
  styleUrl: './schools.component.css'
})
export class SchoolsComponent implements OnInit {
  dbSchools: any[] = [];
  schoolsPages: Pagination = new Pagination();
  role!: string;
  allowedRoles:string[] = ['SuperAdmin','Admin'];
  toastDuration: number = 5000;


  newSchool:string = "";
  constructor(private api: ApiService,private userStore:UserStoreService,private auth:AuthService,private toast:NgToastService) { }

  ngOnInit(): void {  
    this.getSchools()

    this.userStore.getRole().subscribe(val => {
      const roleFromToken = this.auth.getRoleFromToke();
      this.role = val || roleFromToken;
    });
  }

  getSchools() {
    this.api.getSchools().subscribe(
      res => {
        this.dbSchools = res;
        var page: number = res.length;
        this.schoolsPages.genPages(page);
      }
    )
  }

  insertOneSchool(){
    if(this.newSchool == ""){
      this.toast.error({ detail: "ERROR", summary: "Make sure to write the School name before uploading it", duration: this.toastDuration });
      return;
    }

    var school:School = new School();
    school.schoolName = this.newSchool;

    this.api.setnewSchool(school).subscribe({
      next:(value)=>{
        this.getSchools();
        this.toast.success({ detail: "Success", summary: "School uploaded successfully", duration: this.toastDuration });
      },
      error:(error)=>{
        this.toast.error({ detail: "ERROR", summary: error.error.message, duration: this.toastDuration });
      }
    })

    this.newSchool = "";
  }

}
