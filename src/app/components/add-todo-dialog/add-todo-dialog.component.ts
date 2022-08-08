import { DIALOG_DATA } from '@angular/cdk/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { catchError, map, of } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { TodoService } from 'src/app/services/todo.service';
import { TodoDto } from 'src/app/todo/interfaces/todo.interface';

@Component({
  selector: 'app-add-todo-dialog',
  templateUrl: './add-todo-dialog.component.html',
  styleUrls: ['./add-todo-dialog.component.scss']
})
export class AddTodoDialogComponent implements OnInit {

  constructor(
    @Inject(DIALOG_DATA) public data: string,
    private _formBuilder: FormBuilder, 
    private _todoService: TodoService, 
    private _notificationService: NotificationService,
    public dialogRef: MatDialogRef<AddTodoDialogComponent>
  ){}

  addTodoForm: FormGroup = {} as FormGroup;

  ngOnInit(): void {
    this.initTodoForm();
  }

  initTodoForm(){
    this.addTodoForm = this._formBuilder.group({
      userId: new FormControl('', Validators.required),
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required)
    })
  }

  onSubmit(){
    this.addTodoForm.controls["userId"].patchValue(this.data);
    if(!this.addTodoForm.valid){
      this._notificationService.error({message: 'Fill in all mandatory fields'})
      return;     
    }
    const formValue = {
      ...this.addTodoForm.value as TodoDto
    }

    this._todoService.CreateTodo(formValue)
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
