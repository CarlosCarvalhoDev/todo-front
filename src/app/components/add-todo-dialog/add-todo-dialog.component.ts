import { DIALOG_DATA } from '@angular/cdk/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { catchError, map, of } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { TodoService } from 'src/app/services/todo.service';

@Component({
  templateUrl: './add-todo-dialog.component.html',
})
export class AddTodoDialogComponent {

  addTodoForm: FormGroup = this._formBuilder.group({
    userId: new FormControl('', Validators.required),
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required)
  });

  constructor(
    @Inject(DIALOG_DATA) public userId: string,
    private _formBuilder: FormBuilder, 
    private _todoService: TodoService, 
    private _notificationService: NotificationService,
    public dialogRef: MatDialogRef<AddTodoDialogComponent>
  ){
    this.addTodoForm.controls["userId"].patchValue(this.userId);
  }

  onSubmit(){
    if(!this.addTodoForm.valid){
      this._notificationService.error({message: 'Fill in all mandatory fields'})
      return;     
    }
    
    this._todoService.CreateTodo({ ...this.addTodoForm.value })
      .pipe(
        map( () => {
          this._notificationService.success({message: 'Todo was created successfully'});
          this.dialogRef.close(true);
        }),
        catchError((error: HttpErrorResponse) => {
          this._notificationService.error({message: error.message});
          return of(0);
        })
      )
      .subscribe();
  }
}
