import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

export interface Notification {
  message?: string;
  button?: string;
  config?: MatSnackBarConfig;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private _snackbar: MatSnackBar) {}

  private readonly DEFAULT_NOTIFICATION: MatSnackBarConfig = {
    duration: 1500,
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
  }

  private readonly DEFAULT_ERROR_NOTIFICATION: MatSnackBarConfig = {
    duration: 1500,
    horizontalPosition: 'center',
    verticalPosition: 'top',
  }

  private readonly DEFAULT_SUCCESS_NOTIFICATION: MatSnackBarConfig = {
    duration: 1500,
    horizontalPosition: 'right',
    verticalPosition: 'bottom',
  }

  success(notification: Notification): void {
    this._snackbar.open(
      notification.message ?? 'Success!', 
      notification.button  ?? 'Close', 
      notification.config  ?? this.DEFAULT_SUCCESS_NOTIFICATION
    );
  }

  error(notification: Notification): void {
    this._snackbar.open(
      notification.message ?? 'An unexpected error occurred.', 
      notification.button  ?? 'Close', 
      notification.config  ?? this.DEFAULT_ERROR_NOTIFICATION
    );
  }

  message(notification: Notification): void {
    this._snackbar.open(
      notification.message ?? 'Success!', 
      notification.button  ?? 'Close', 
      notification.config  ?? this.DEFAULT_NOTIFICATION
    );
  }
}


