import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { UserStoreService } from '../../services/user-store.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {

  public users:any = [];
  public role!:string;
  constructor(private auth: AuthService, private router: Router,private api : ApiService,private userStore: UserStoreService){
    
  }

  ngOnInit(): void {
    this.api.getUsers()
    .subscribe(res=>{
    this.users = res;
    });
    this.userStore.getRole().subscribe(val=>{
      const roleFromToken = this.auth.getRoleFromToke();
      this.role = val || roleFromToken;
    })

  }
}
