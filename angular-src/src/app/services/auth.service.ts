import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {
  user: any;

  constructor(private http:Http) { }

  registerUser(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:8000/register', user, {headers: headers})
      .map(res => res.json());
  }

  loginUser(user) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:8000/login', user, {headers: headers})
      .map(res => res.json());
  }

  storeUserData(user) {
    localStorage.setItem('user', JSON.stringify(user));
    this.user = user;
  }

  logout(){
    this.user = null;
    localStorage.clear();
  }

}
