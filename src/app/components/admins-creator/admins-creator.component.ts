import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { NgToastService } from 'ng-angular-popup';
import { UserStoreService } from '../../services/user-store.service';
import { AuthService } from '../../services/auth.service';
import { CreateUserRequestForm } from '../../models/User.model';
import { Pagination } from '../../models/Pagination.model';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-admins-creator',
  templateUrl: './admins-creator.component.html',
  styleUrl: './admins-creator.component.css'
})
export class AdminsCreatorComponent implements OnInit{
  @ViewChild('staticModal') staticModal: ModalDirective|undefined;
  role!:string;
  isActive:boolean = false;
  dbRoles:any[] = [];
  dbUsers:any[] = []
  userPages:Pagination = new Pagination();
  toastDuration:number = 5000;

  newUserRole:string = '';
  newUserName:string = '';
  newUserEmail:string = '';

  ConfirmationDescription:string = '';
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
        this.userPages.genPages(this.dbUsers.length);
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

  onConfirm(){
    if(this.staticModal){
      this.staticModal.hide();
    }
  }

  openConfirmation(){
    if(this.staticModal){
      this.staticModal.show();
    }
  }

  submit(){
    console.log(this.isActive);
  }
}
