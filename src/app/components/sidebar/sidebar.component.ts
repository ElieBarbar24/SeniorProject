
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ActiveLinkServiceService } from '../../services/active-link-service.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {

  navigationItems = [
    { label: 'Schedule', iconClass: 'fa-solid fa-calendar-days', route: 'Schedule', roles: ['SuperAdmin', 'Admin','Proctor'] },
    { label: 'Information', iconClass: 'fa-solid fa-location-dot', route: 'Information', roles: ['SuperAdmin', 'Admin','Proctor']  },
    { label: 'Instructors', iconClass: 'fa-solid fa-chalkboard-user', route: 'Instructors', roles: ['SuperAdmin', 'Admin','Proctor']  },
    { label: 'Course', iconClass: 'fa-solid fa-book', route: 'Course', roles: ['SuperAdmin', 'Admin','Proctor']  },
    { label: 'Room', iconClass: 'fa-solid fa-table-cells-large', route: 'Room', roles: ['SuperAdmin', 'Admin','Proctor'] },
    { label: 'Section', iconClass: 'fa-solid fa-hourglass', route: 'Section', roles: ['SuperAdmin', 'Admin','Proctor']  },
    { label: 'Admins', iconClass: 'fa-solid fa-shield', route: 'Admins', roles: ['SuperAdmin', 'Admin'] }
  ];

  activeLink!: string;
  @Input() name: string | undefined;
  @Input() role: string | undefined;

  constructor(private router: Router, private auth: AuthService, private activeLinkService: ActiveLinkServiceService) {
    const storedLink = this.activeLinkService.getActiveLink();
    this.activeLink = storedLink || '';
    this.navigateTo(this.activeLink);
  }

  navigateTo(route: string): void {
    this.activeLink = route;
    this.activeLinkService.setActiveLink(route);
    this.router.navigate(['DashBoard', route]);
  }

  Logout() {
    this.auth.signOut();
  }

}
