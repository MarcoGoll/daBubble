import { Component, inject } from '@angular/core';
import { HeaderSimpleComponent } from '../../_shared/components/header-simple/header-simple.component';
import { FooterSimpleComponent } from '../../_shared/components/footer-simple/footer-simple.component';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthenticationService } from '../../_shared/services/firebase/authentication.service';

@Component({
  selector: 'app-page-login',
  standalone: true,
  imports: [
    FormsModule,
    HeaderSimpleComponent,
    FooterSimpleComponent,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
  ],
  templateUrl: './page-login.component.html',
  styleUrl: './page-login.component.scss',
})
export class PageLoginComponent {
  authService = inject(AuthenticationService);
  GUESTUSER: { email: string; pw: string } = {
    email: 'guest@user.de',
    pw: '123456',
  };

  /**
   * Handles the form submission.
   *
   * @param {NgForm} ngForm - The form object that contains the login data to be submitted.
   */
  onSubmit(ngForm: NgForm) {
    console.log('Submit is done');
  }

  submitAsGuest() {
    console.log('Submit as guest is done');
    this.authService.login(this.GUESTUSER.email, this.GUESTUSER.pw);
  }
}
