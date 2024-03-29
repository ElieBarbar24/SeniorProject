import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ActiveLinkServiceService {

  constructor() { }

  setActiveLink(route: string) {
    localStorage.setItem('activeLink', route);
  }
  
  getActiveLink(): string | null {
    return localStorage.getItem('activeLink');
  }
}
