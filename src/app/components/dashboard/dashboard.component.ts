import { state, style, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { UserStoreService } from '../../services/user-store.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  animations: [
    trigger('transform', [
      state('start', style({

      })),
    ]),
  ],
})
export class DashboardComponent implements OnInit {
  isDropup = true;
  public users: any = [];
  public name!: string;
  public role!: string;
  constructor(private auth: AuthService, private api: ApiService, private userStore: UserStoreService,) {
  }

  ngOnInit(): void {

    this.userStore.getName()
      .subscribe(val => {
        const nameFromToken = this.auth.getNameFromToken();
        this.name = val || nameFromToken;
      })

    this.userStore.getRole()
      .subscribe(val => {
        const roleFromToken = this.auth.getRoleFromToke();
        this.role = val || roleFromToken;
      })
  }


}
