import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { UserStoreService } from '../../services/user-store.service';
import { AuthService } from '../../services/auth.service';
import { Pagination } from '../../models/Pagination.model';

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

  constructor(private api: ApiService,private userStore:UserStoreService,private auth:AuthService) { }
  
  ngOnInit(): void {
    
    this.getDep();
    this.userStore.getRole().subscribe(val=>{
      const roleFromToken = this.auth.getRoleFromToke();
      this.role = val || roleFromToken;
    });
  }

  getDep(){
    this.api.getDep().subscribe({
      next:(data)=>{
        this.dbDep = data;
        var page:number = data.length;
        this.depPages.genPages(page);
      }
    })
  }
}
