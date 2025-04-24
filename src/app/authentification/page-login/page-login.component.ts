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
import { RouterLink } from '@angular/router';
import { UserService } from '../../_shared/services/firebase/user.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';

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
    MatSnackBarModule,
    RouterLink,
  ],
  templateUrl: './page-login.component.html',
  styleUrl: './page-login.component.scss',
})
export class PageLoginComponent {
  authService = inject(AuthenticationService);
  userService = inject(UserService);
  email: string = '';
  password: string = '';

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
    this.markControlsAsTouched(ngForm);
    this.authService.login(this.email, this.password);
  }

  submitAsGuest() {
    console.log('Submit as guest is done');
    this.authService.login(this.GUESTUSER.email, this.GUESTUSER.pw);
  }

  /**
   * Marks all form controls as touched to trigger validation messages.
   *
   * @param {NgForm} ngForm - The form object whose controls should be marked as touched.
   */
  markControlsAsTouched(ngForm: NgForm) {
    // Mark all controls as touched to trigger validation messages
    Object.values(ngForm.controls).forEach((control) => {
      control.markAsTouched();
    });
  }
}
