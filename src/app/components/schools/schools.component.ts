import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Pagination } from '../../models/Pagination.model';
import { UserStoreService } from '../../services/user-store.service';
import { AuthService } from '../../services/auth.service';

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


  constructor(private api: ApiService,private userStore:UserStoreService,private auth:AuthService) { }

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
}
