import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenApiModel } from '../models/token-api.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // private baseUrl:string = "https://localhost:7047/api/User/";

  private baseUrl:string = "https://localhost:7047/api/User/";
  private userPayLoad:any;
  constructor(private http: HttpClient,private router:Router) { 
    this.userPayLoad = this.decodeToken();
  }

  register(userObj:any){
    return this.http.post<any>(`${this.baseUrl}register`,userObj)
  }

  login(loginObj:any){
    return this.http.post<any>(`${this.baseUrl}authenticate`,loginObj)
  }

  signOut(){
    localStorage.clear();
    this.router.navigate(['login']);
  }

  storeToken(tokenValue:string){
    localStorage.setItem('token',tokenValue)
  }

  storeRefreshToken(tokenValue: string){
    localStorage.setItem('refreshToken', tokenValue)
  }

  getToken(){
    return localStorage.getItem('token')
  }

  getRefreshToken(){
    return localStorage.getItem('refreshToken')
  }

  isLoggedIn():boolean{
    return !!localStorage.getItem('token')
  }

  decodeToken(){
    const jwt = new JwtHelperService();
    const token = this.getToken()!;
    return jwt.decodeToken(token);
  }

  getNameFromToken(){
    if(this.userPayLoad)
    return this.userPayLoad.name;
  }

  getRoleFromToke(){
    if(this.userPayLoad)

    return this.userPayLoad.role;
  }

  renewToken(tokenApi : TokenApiModel){
    return this.http.post<any>(`${this.baseUrl}refresh`, tokenApi)
  }
}
