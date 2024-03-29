import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { UserStoreService } from '../../services/user-store.service';
import { ActiveLinkServiceService } from '../../services/active-link-service.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  toastDuration: number = 5000;
  isDisabled: boolean = false;
  loginForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private routes: Router,
    private toast: NgToastService,
    private userStore:UserStoreService,
    private activeLink:ActiveLinkServiceService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  //Login Logic
  onSubmit() {
    if (this.loginForm.valid) {
      this.isDisabled = true;
      this.auth.login(this.loginForm.value).subscribe({
        next: (res) => {
          this.isDisabled = false;
          this.auth.storeToken(res.accessToken);
          this.auth.storeRefreshToken(res.refreshToken);
          this.activeLink.setActiveLink('Schedule');
          let tokenPayLoad = this.auth.decodeToken();
          this.userStore.setName(tokenPayLoad.name);
          this.userStore.setRole(tokenPayLoad.role);
          this.toast.success({detail:"Success", summary:"Login Success",duration:this.toastDuration});

          this.routes.navigate(['DashBoard']);
        },
        error: (err) => {
          this.isDisabled = false;
          this.isDisabled = false;
          if (err.error && err.error.code === 1) {
            // Bad Request - Invalid request or user data missing
            this.toast.error({ detail: "ERROR", summary: "Invalid request. User data is missing.", duration: this.toastDuration });
          } else if (err.error && err.error.code === 2) {
            // Not Found - User not found
            this.toast.error({ detail: "ERROR", summary: "User not found.", duration: this.toastDuration });
          } else if (err.error && err.error.code === 3) {
            // Unauthorized - Invalid password
            this.toast.error({ detail: "ERROR", summary: "Invalid password.", duration: this.toastDuration });
          } else {
            // Other errors - Unexpected server error
            this.toast.error({ detail: "ERROR", summary: "An unexpected error occurred.", duration: this.toastDuration });
          }
        },
      });
    } else {
      this.validateAllFormFileds(this.loginForm);
    }
  }

  private validateAllFormFileds(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsDirty({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFileds(control);
      }
    });
  }
}
