import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { NgToastService } from 'ng-angular-popup';
import { UserStoreService } from '../../services/user-store.service';
import { AuthService } from '../../services/auth.service';
import { CreateUserRequestForm } from '../../models/User.model';

@Component({
  selector: 'app-admins-creator',
  templateUrl: './admins-creator.component.html',
  styleUrl: './admins-creator.component.css'
})
export class AdminsCreatorComponent implements OnInit{
  role!:string;
  isActive:boolean = false;
  dbRoles:any[] = [];
  dbUsers:any[] = []

  toastDuration:number = 5000;

  newUserRole:string = '';
  newUserName:string = '';
  newUserEmail:string = '';
  constructor(private api:ApiService,private toast:NgToastService,private userStore:UserStoreService,private auth:AuthService){}


  ngOnInit(): void {
    this.getRoles();
    this.getUsers();
    this.userStore.getRole()
      .subscribe(val=>{
        const roleFromToken = this.auth.getRoleFromToke();
        this.role = val||roleFromToken;
      });
  }

  getRoles(){
    this.api.getRoles().subscribe({
      next:(data)=>{
        this.dbRoles = data;
        console.log(this.dbRoles);
      }
    })
  }

  getUsers(){
    this.api.getUsers().subscribe({
      next:(data)=>{
        this.dbUsers = data;
        console.log(this.dbUsers);
      }
    })
  }

  onSubmit(){
    var user:CreateUserRequestForm = this.createUserRequest();
    this.api.createUser(user).subscribe({
      next:(value)=>{
        this.toast.success({detail:"Success",summary:"User Created Successfully",duration:this.toastDuration})
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }

  createUserRequest():CreateUserRequestForm{
    var user:CreateUserRequestForm = new CreateUserRequestForm();
    
    user.isActive = this.isActive;
    user.email = this.newUserEmail;
    user.username = this.newUserName;
    user.roleID = this.newUserRole;

    return user;
  }

  submit(){
    console.log(this.isActive);
  }
}
