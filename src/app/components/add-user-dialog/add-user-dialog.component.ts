import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { catchError, map, of } from "rxjs";
import { UserService } from "src/app/services/user.service";
import { UserResponseViewModel, UserDto } from "../../todo/interfaces/user.interface";


@Component({
    templateUrl: './add-user-dialog.component.html',
    styleUrls: ['./add-user-dialog.component.scss']
})
export class AddUserDialogComponent implements OnInit{
  
  constructor(
    private _formBuilder: FormBuilder, 
    private _userService: UserService, 
    private _snackBar: MatSnackBar,
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
      this._snackBar.open(  'Existem campos obrigatórios nao preenchidos.', 'Close', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
      return;     
    }
    const formValue = {
      ...this.addUserForm.value as UserDto
    }
    this.userData = formValue;
    this._userService.CreateUser(this.userData)
      .pipe(
        map(user => {
          this.openSnackBar('User ' + user.name + ' Created');
          this.dialogRef.close(true);
        }),
        catchError((error: HttpErrorResponse) => {
          this.openSnackBar(error.message)
          return of(0);
        })
      )
      .subscribe();
  }

  openSnackBar(message: string) {
    this._snackBar.open(  message, 'Close', {
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
  }
}