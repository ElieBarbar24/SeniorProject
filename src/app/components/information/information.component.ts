import { Component, OnInit } from '@angular/core';
import { ActiveLinkServiceService } from '../../services/active-link-service.service';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrl: './information.component.css'
})
export class InformationComponent{
  dbcampuses:any=[];
  navData =[
    {routLink:'Campuses',label:'Campuses'},
    {routLink:'Schools',label:'Schools'},
    {routLink:'Departement',label:'Departement'},

  ]

  activeLink:string;

  constructor(private router: Router,private api:ApiService,private activeLinkService:ActiveLinkServiceService){
      const storedLink = this.activeLinkService.getInformationActiveLink();
      this.activeLink = storedLink||'';
      this.navigateTo(this.activeLink);
  }
  

  

  navigateTo(childRoute: string): void {
    this.activeLink = childRoute;
    this.activeLinkService.setInformationActiveLink(childRoute);
  
    if (childRoute) {

      this.router.navigate(['DashBoard', 'information', childRoute]);
    } else {

      this.router.navigate(['DashBoard', 'information']);
    }
  }
  
}
