import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  isDisabled: boolean = false;
  registerForm!: FormGroup;
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required,Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8),this.validatePassword.bind(this)]],
    });
  }

  private validatePassword(control: FormControl): { [key: string]: boolean } | null {
    const value: string = control.value;

    // Check if the password contains at least one lowercase letter
    const hasLowercase = /[a-z]/.test(value);

    // Check if the password contains at least one uppercase letter
    const hasUppercase = /[A-Z]/.test(value);

    // Check if the password contains at least one special character
    const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(value);

    // Return an error if any of the conditions is not met
    if (!hasLowercase) {
      return { LowercaseCaseRequirement: true };
    }
    if(!hasUppercase){
      return { upperCaseRequirement: true };
    }
    if(!hasSpecialChar){
      return { specialCharRequirement: true };
    }
    return null;
  }

  // register Logic
  onSubmit() {
    if (this.registerForm.valid) {
      this.isDisabled = true;
      this.auth.register(this.registerForm.value).subscribe({
        next: (res) => {
          this.isDisabled=false;
          alert(res.message);
          this.registerForm.reset();
          this.router.navigate(['login']);
        },
        error: (err) => {
          this.isDisabled=false;
          alert(err?.error.message);
        },
      });
    } else {
      this.validateAllFormFileds(this.registerForm);
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
