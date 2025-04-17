import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  isUserLoggedIn: boolean = false;

  constructor() {}

  checkLogin() {
    //TODO: implement logic
    console.log('TBD: build feature checkLogin()');
    this.isUserLoggedIn = false; //always true until logic will be implemented
    return this.isUserLoggedIn;
  }
}
