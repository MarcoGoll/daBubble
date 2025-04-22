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

@Component({
  selector: 'app-page-signup',
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
    RouterLink,
  ],
  templateUrl: './page-signup.component.html',
  styleUrl: './page-signup.component.scss',
})
export class PageSignupComponent {
  authService = inject(AuthenticationService);
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  passwordRepeat: string = '';
  isSignupStep: number = 1;
  selectedAvatar: number = 1;

  constructor() {
    this.isSignupStep = 1;
  }

  /**
   * Handles the form submission.
   *
   * @param {NgForm} ngForm - The form object that contains the signup data to be submitted.
   */
  onSubmit(ngForm: NgForm) {
    console.log('Signup is done');
  }

  setNextSignupStep() {
    this.isSignupStep += 1;
  }

  setPreviousSignupStep() {
    this.isSignupStep -= 1;
  }

  setSelectedAvatarTo(id: number) {
    this.selectedAvatar = id;
  }
}
