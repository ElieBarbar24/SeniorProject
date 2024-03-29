import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'my-app';

  constructor(private auth:AuthService,private router:Router){
    if(this.auth.isLoggedIn()){
      this.router.navigate(['DashBoard',['']])
    }
  }
}
