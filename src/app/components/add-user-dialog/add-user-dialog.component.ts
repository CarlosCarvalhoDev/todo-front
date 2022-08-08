import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { catchError, map, of } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';


@Component({
    templateUrl: './add-user-dialog.component.html',
})
export class AddUserDialogComponent{
  addUserForm: FormGroup = this._formBuilder.group({
    name: new FormControl('', Validators.required),
    email: new FormControl('', Validators.email),
    password: new FormControl('', Validators.required)
  });
  
  constructor(
    private _formBuilder: FormBuilder, 
    private _userService: UserService, 
    private _notificationService: NotificationService,
    public dialogRef: MatDialogRef<AddUserDialogComponent>
  ){}
  
  onSubmit(){
    if(!this.addUserForm.valid){
      this._notificationService.message({message: 'Fill in all mandatory fields' })
      return;     
    }

    this._userService.CreateUser({ ...this.addUserForm.value })
      .pipe(
        map(user => {
          this._notificationService.success({message: 'User ' + user.name + ' Created' })
          this.dialogRef.close(true);
        }),
        catchError((error: HttpErrorResponse) => {
          this._notificationService.error({message: error.message })
          return of(0);
        })
      )
      .subscribe();
  }
}