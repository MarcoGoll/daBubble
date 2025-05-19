import { inject, Injectable } from '@angular/core';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  signOut,
  User,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { UserService } from './user.service';
const googleAuthProvider = new GoogleAuthProvider();

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  router = inject(Router);
  auth = inject(Auth);
  userService = inject(UserService);

  isUserLoggedIn: boolean = false;
  currentLoggedInUser: User | null = null;
  errorMessageForFailedFirebaseRequest: string = '';
  errorOccoursIn:
    | 'fullname'
    | 'email'
    | 'pw'
    | 'pwConfirm'
    | 'email-pw'
    | 'global'
    | null = null;

  constructor() {}

  // ##########################################################################################################
  // Authentication via EMAIL AND PW
  // ##########################################################################################################
  /**
   * Creates a new user with the given email and password using Firebase authentication.
   *
   * @param {string} email - The email address of the user.
   * @param {string} password - The password for the user account.
   * @returns {Promise<void>} A promise that resolves when the user is created or rejects if an error occurs.
   */
  async createUser(email: string, password: string) {
    await createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        // Signed up
        this.userService.uidToBeSet = userCredential.user.uid;
        this.resetFirebaseError();
        // ...
      })
      .catch((error) => {
        this.setFirebaseError(error);
      });
  }

  /**
   * Logs in an existing user with the given email and password using Firebase authentication.
   *
   * @param {string} email - The email address of the user.
   * @param {string} password - The password for the user account.
   * @returns {Promise<void>} A promise that resolves when the user is logged in or rejects if an error occurs.
   */
  async login(email: string, password: string) {
    await signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        // Signed in
        this.isUserLoggedIn = true;
        this.currentLoggedInUser = userCredential.user;
        this.setUserLoginStatus(this.currentLoggedInUser.uid, true);
        this.router.navigate(['/']);
        console.log('This user was logged in: ', userCredential.user);

        this.resetFirebaseError();
      })
      .catch((error) => {
        this.setFirebaseError(error);
      });
  }

  /**
   * Logs out the current authenticated user using Firebase authentication.
   * Redirects the user to the home page after successful logout.
   *
   * @returns {Promise<void>} A promise that resolves when the user is logged out or rejects if an error occurs.
   */
  async logout() {
    if (this.currentLoggedInUser) {
      this.setUserLoginStatus(this.currentLoggedInUser.uid, false);
    }
    await signOut(this.auth)
      .then(() => {
        // Signed out
        this.isUserLoggedIn = false;
        this.currentLoggedInUser = null;
        this.router.navigate(['/login']);
        this.resetFirebaseError();
        // ...
      })
      .catch((error) => {
        this.setFirebaseError(error);
      });
  }

  /**
   * Checks the authentication state of the user. If a user is signed in, sets the user data
   * and returns `true`. If the user is signed out, clears the user data and returns `false`.
   *
   * @returns {Promise<boolean>} A promise that resolves with `true` if a user is logged in,
   *                             and `false` if the user is not logged in.
   */ async checkLogin(): Promise<boolean> {
    return new Promise((resolve) => {
      onAuthStateChanged(this.auth, (user) => {
        if (user) {
          // User is signed in
          this.currentLoggedInUser = user;
          this.isUserLoggedIn = true;
          resolve(true);
        } else {
          // User is signed out
          this.currentLoggedInUser = null;
          this.isUserLoggedIn = false;
          resolve(false);
        }
      });
    });
  }

  /**
   * Updates the authenticated user's profile with the provided full name.
   * If the user is authenticated, the profile's display name will be updated.
   *
   * @param {string} fullName - The new full name to set as the user's display name.
   * @returns {Promise<void>} A promise that resolves when the profile is successfully updated or rejects if an error occurs.
   */
  async updateUserFullName(fullName: string) {
    const user: User | null = this.auth.currentUser;
    if (user) {
      await updateProfile(user, {
        displayName: fullName,
      })
        .then(() => {
          // Profile updated!
          this.resetFirebaseError();
        })
        .catch((error) => {
          // An error occurred
          this.setFirebaseError(error);
        });
    }
  }

  // ##########################################################################################################
  // Authentication via Google
  // ##########################################################################################################
  async loginWithGoogle() {
    await signInWithPopup(this.auth, googleAuthProvider)
      .then((userCredential) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential =
          GoogleAuthProvider.credentialFromResult(userCredential);
        const token = credential?.accessToken;
        // The signed-in user info.
        const user = userCredential.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
        this.isUserLoggedIn = true;
        this.currentLoggedInUser = userCredential.user;
        this.router.navigate(['/']);
        console.log('This user was logged in: ', this.currentLoggedInUser);
        //TODO: CREATE USER within DB IF NOT ALREADY CREATED
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
        this.setFirebaseError(error);
      });
  }

  // ##########################################################################################################
  // Statushandling
  // ##########################################################################################################
  setUserLoginStatus(userUid: string, loggedIn: boolean) {
    const foundedUser = this.userService.users.find(
      (user) => user.uid === userUid
    );
    if (foundedUser) {
      foundedUser.isloggedIn = loggedIn;
      this.userService.updateUser(foundedUser);
      console.log('foundUser: ', foundedUser);
    } else {
      console.warn('Found no user with this uid.');
    }
  }

  // ##########################################################################################################
  // Errorhandling
  // ##########################################################################################################
  /**
   * Sets the appropriate error message based on the Firebase authentication error code.
   * Updates the error message and the field where the error occurred.
   *
   * @param {any} error - The error object returned by Firebase containing error details.
   */
  setFirebaseError(error: any) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        this.errorOccoursIn = 'email';
        this.errorMessageForFailedFirebaseRequest = 'Email is already in use';
        break;
      case 'auth/weak-password':
        this.errorOccoursIn = 'pw';
        this.errorMessageForFailedFirebaseRequest =
          'Weak password. Use at least 6 characters';
        break;
      case 'auth/invalid-credential':
        this.errorOccoursIn = 'email-pw';
        this.errorMessageForFailedFirebaseRequest =
          'Check your email and password. Please try again.';
        break;
      default:
        this.errorOccoursIn = 'global';
        this.errorMessageForFailedFirebaseRequest =
          'Technical Error, please try again later';
    }
  }

  /**
   * Resets the Firebase error state by clearing the error field and message.
   * This function is typically called when the error has been resolved or cleared.
   */
  resetFirebaseError() {
    this.errorOccoursIn = null;
    this.errorMessageForFailedFirebaseRequest = '';
  }
}
