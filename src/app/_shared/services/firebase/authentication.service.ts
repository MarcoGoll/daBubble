import { Injectable } from '@angular/core';
import { User } from '../../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  isUserLoggedIn: boolean = false;
  currentLoggedInUser: User | null = null;
  GUESTUSER: { email: string; pw: string } = {
    email: 'guest@user.de',
    pw: '123456',
  };

  constructor() {}

  checkLogin() {
    //TODO: implement logic
    console.log('TBD: build feature checkLogin()');
    this.isUserLoggedIn = false; // until logic will be implemented
    return this.isUserLoggedIn;
  }
}
