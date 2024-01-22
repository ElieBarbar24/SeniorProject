import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {JwtHelperService} from '@auth0/angular-jwt'

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {
  private Name$ = new BehaviorSubject<string>("");
  private Role$ = new BehaviorSubject<string>("");

  constructor() { }

  public getRole(){
    return this.Role$.asObservable();
  }

  public getName(){
    return this.Name$.asObservable();
  }

  public setRole(Role:string){
    return this.Role$.next(Role);
  }

  public setName(Name:string){
    return this.Name$.next(Name);
  }

  
}
