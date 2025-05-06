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
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../_shared/services/firebase/user.service';
import { User } from '../../_shared/interfaces/user';
import { GlobalMessagesService } from '../../_shared/services/global-messages.service';

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
    CommonModule,
  ],
  templateUrl: './page-signup.component.html',
  styleUrl: './page-signup.component.scss',
})
export class PageSignupComponent {
  authService = inject(AuthenticationService);
  userService = inject(UserService);
  globalMessageService = inject(GlobalMessagesService);
  password: string = '';
  passwordRepeat: string = '';
  isSignupStep: number = 1;
  selectedAvatar: number = 1;
  userToSignup: User = {
    firstName: '',
    lastName: '',
    fullName: '',
    email: '',
    avatarId: 1,
    channelIds: [],
    isloggedIn: false,
    uid: '',
  };

  constructor(private router: Router) {
    this.isSignupStep = 1;
  }

  /**
   * Handles the confirmation of the contact data.
   *
   * @param {NgForm} ngForm - The form object that contains the signup data to be submitted.
   */
  confirmContactData(ngForm: NgForm) {
    this.markControlsAsTouched(ngForm);
    if (!this.checkPasswordsMatch(ngForm)) {
      return; // Stops at PW missmatch
    }
    if (ngForm.valid) {
      this.setUserToSignupFullName();
      this.setNextSignupStep();
    }
  }

  /**
   * Sets the full name of the user to sign up by concatenating
   * their first and last names with a space in between.
   */
  setUserToSignupFullName() {
    this.userToSignup.fullName =
      this.userToSignup.firstName + ' ' + this.userToSignup.lastName;
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

  /**
   * Checks if the entered passwords match and sets form control errors if they don't.
   *
   * @param {NgForm} ngForm - The form object containing the password fields.
   * @returns {boolean} - Returns true if passwords match, otherwise false.
   */
  checkPasswordsMatch(ngForm: NgForm): boolean {
    if (this.password !== this.passwordRepeat) {
      const passwordControl = ngForm.controls['password'];
      const passwordRepeatControl = ngForm.controls['passwordRepeat'];
      if (passwordControl) passwordControl.setErrors({ mismatch: true });
      if (passwordRepeatControl)
        passwordRepeatControl.setErrors({ mismatch: true });
      return false;
    }
    return true;
  }

  /**
   * Advances the signup process to the next step.
   */
  setNextSignupStep() {
    this.isSignupStep += 1;
  }

  /**
   * Moves the signup process back to the previous step.
   */
  setPreviousSignupStep() {
    this.isSignupStep -= 1;
  }

  /**
   * Sets the selected avatar to the given ID.
   *
   * @param {number} id - The ID of the avatar to select.
   */
  setSelectedAvatarTo(id: number) {
    this.selectedAvatar = id;
    this.userToSignup.avatarId = id;
  }

  async saveUser(ngForm: NgForm) {
    await this.authService.createUser(this.userToSignup.email, this.password);
    await this.authService.updateUserFullName(this.userToSignup.fullName);
    await this.userService.createUser(this.userToSignup);
    this.globalMessageService.showSnackbarNotification(
      'Der Nutzer wurde erfolgreich angelegt.',
      '',
      'success'
    );
    ngForm.resetForm();
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
