import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { UserStoreService } from '../../services/user-store.service';
import { AuthService } from '../../services/auth.service';
import { Pagination } from '../../models/Pagination.model';
import { School } from '../../models/School.model';
import { Departement } from '../../models/Departement.model';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.css'
})
export class DepartmentsComponent {
  role!: string;
  depPages:Pagination = new Pagination();
  dbDep:any[] = [];
  allowedRoles:string[] = ['SuperAdmin','Admin'];
  dbSchools:any[] = [];
  toastDuration: number = 5000;

  newDepName:string = "";
  newDepSchoolId:string = "";
  constructor(private toast:NgToastService,private api: ApiService,private userStore:UserStoreService,private auth:AuthService) { }
  
  ngOnInit(): void {
    this.getDep();
    this.getSchools();
    this.userStore.getRole().subscribe(val=>{
      const roleFromToken = this.auth.getRoleFromToke();
      this.role = val || roleFromToken;
    });
  }

  getDep(){
    this.api.getDep().subscribe({
      next:(data)=>{
        this.dbDep = data;
        var page:number = this.dbDep.length;
        console.log(this.dbDep);
        this.depPages.genPages(page);
      }
    })
  }
  insertDepartment(){
    if(this.newDepName == ""||this.newDepSchoolId==""){
      this.toast.error({ detail: "ERROR", summary: "Make sure to write the School name before uploading it", duration: this.toastDuration });
      return ;
    }
    var dep:Departement = new Departement();
    dep.departementName = this.newDepName;
    dep.schoolID = this.newDepSchoolId;

    this.api.setnewDep(dep).subscribe({
      next:(value)=>{
        this.getDep();
        this.toast.success({ detail: "Success", summary: "Department uploaded successfully", duration: this.toastDuration });
      },
      error:(error)=>{
        this.toast.error({ detail: "ERROR", summary: error.error.message, duration: this.toastDuration });
      }
    });

    this.newDepName = "";
    this.newDepSchoolId = "";
  }
  getSchools() {
    this.api.getSchools().subscribe(
      res => {
        this.dbSchools = res;
        console.log(this.dbSchools);
      }
    )
  }
}
