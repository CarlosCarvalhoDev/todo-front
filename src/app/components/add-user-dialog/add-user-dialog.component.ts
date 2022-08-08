import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { catchError, map, of } from "rxjs";
import { NotificationService } from "src/app/services/notification.service";
import { UserService } from "src/app/services/user.service";
import { UserDto } from "../../todo/interfaces/user.interface";


@Component({
    templateUrl: './add-user-dialog.component.html',
    styleUrls: ['./add-user-dialog.component.scss']
})
export class AddUserDialogComponent implements OnInit{
  
  constructor(
    private _formBuilder: FormBuilder, 
    private _userService: UserService, 
    private _notificationService: NotificationService,
    public dialogRef: MatDialogRef<AddUserDialogComponent>
  ){}
  
  addUserForm: FormGroup = {} as FormGroup;
  userData: UserDto = {} as UserDto;

  ngOnInit(): void {
    this.initAddUserForm();
  }

  initAddUserForm(){
    this.addUserForm = this._formBuilder.group({
      name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.email),
      password: new FormControl('', Validators.required)
    })
  }

  onSubmit(){
    if(!this.addUserForm.valid){
      this._notificationService.message({message: 'Fill in all mandatory fields' })
      return;     
    }

    const formValue = {
      ...this.addUserForm.value as UserDto
    }

    this.userData = formValue;
    this._userService.CreateUser(this.userData)
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