import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class GlobalMessagesService {
  private _snackBar = inject(MatSnackBar);

  constructor() {}

  /**
   * Displays a notification using a snackbar with a specified message, action, status, and optional duration.
   * The snackbar will be styled based on the status.
   *
   * @param {string} message - The message to display in the snackbar.
   * @param {string} action - The action label displayed in the snackbar, e.g., 'Close'.
   * @param {'success' | 'fail' | 'warn' | 'info'} status - The status of the notification, which determines the snackbar's styling.
   * @param {number} [duration=4000] - Optional duration in milliseconds for how long the snackbar is visible. Default: 4000
   */
  showSnackbarNotification(
    message: string,
    action: string,
    status: 'success' | 'fail' | 'warn' | 'info',
    duration: number = 4000
  ): void {
    let panelClass: string[] = [];

    switch (status) {
      case 'success':
        panelClass = ['snackbar-success'];
        break;
      case 'fail':
        panelClass = ['snackbar-error'];
        break;
      case 'warn':
        panelClass = ['snackbar-warn'];
        break;
      case 'info':
        panelClass = ['snackbar-info'];
        break;
      default:
        panelClass = ['snackbar-default'];
        break;
    }

    this._snackBar.open(message, action, {
      duration: duration,
      panelClass: panelClass,
    });
  }
}
