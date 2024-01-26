
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ActiveLinkServiceService } from '../../services/active-link-service.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit{
  isDropup = true;
  navData = [
    {routeLink:'admin',icon:'fa fa-home',label:'Dashboard'},
    {routeLink:'information',icon:'fa-solid fa-calendar-days',label:'Information'},
    {routeLink:'scheduler',icon:'fa-solid fa-calendar-days',label:'Scheduler'},
    {routeLink:'instructors',icon:'fa-solid fa-calendar-days',label:'Instructors'},
    {routeLink:'course',icon:'fa-solid fa-calendar-days',label:'Courses/Sections'},
    {routeLink:'room',icon:'fa-solid fa-calendar-days',label:'Rooms'},
  ]
  activeLink:string;
  @Input() name:string | undefined;
  @Input() role:string | undefined;

  constructor(private router: Router,private auth:AuthService,private activeLinkService:ActiveLinkServiceService) {
      const storedLink = this.activeLinkService.getActiveLink();
      this.activeLink = storedLink||'';
      this.navigateTo(this.activeLink);
  }

  ngOnInit(): void {
    this.navigateTo(this.activeLink);
  }

  navigateTo(route: string): void {
    this.activeLink = route;
    this.activeLinkService.setActiveLink(route);
    this.router.navigate(['DashBoard', route]);
  }
  
  Logout(){
    this.auth.signOut();
  }

}
