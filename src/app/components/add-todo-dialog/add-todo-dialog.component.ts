import { DIALOG_DATA } from '@angular/cdk/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, map, of, pipe } from 'rxjs';
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
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AddTodoDialogComponent>
  ){}

  addTodoForm: FormGroup = {} as FormGroup;
  todoData: TodoDto = {} as TodoDto;

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
      this._snackBar.open(  'Existem campos obrigatórios nao preenchidos.', 'Close', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
      return;     
    }
    const formValue = {
      ...this.addTodoForm.value as TodoDto
    }
    this.todoData = formValue;

    this._todoService.CreateTodo(this.todoData)
      .pipe(
        map( () => {
          this.openSnackBar('Todo is Created');
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
