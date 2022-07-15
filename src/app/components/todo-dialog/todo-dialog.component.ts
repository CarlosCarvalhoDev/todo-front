import { DIALOG_DATA } from '@angular/cdk/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, HostListener, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FloatLabelType } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, map, of } from 'rxjs';
import { TaskService } from 'src/app/services/task.service';
import { TodoService } from 'src/app/services/todo.service';

import { TaskDto, TaskModel } from '../../todo/interfaces/task.interface';
import { Todo, UpdateTodoDTO } from '../../todo/interfaces/todo.interface';

@Component({
  templateUrl: './todo-dialog.component.html',
  styleUrls: ['./todo-dialog.component.scss']
})
export class TodoDialogComponent{
  todo!: Todo;
  hideTaskField: boolean = false;
  deleteTaskOption: number | null = null;

  taskForm: FormGroup = this._fb.group({
    title: new FormControl('', Validators.required)
  })

  todoForm: FormGroup = this._fb.group({
    id: new FormControl(''),
    title: new FormControl(''),
    description: new FormControl(''),
    tasks: new FormArray([]),
  });

  floatLabelControl = new FormControl('auto' as FloatLabelType);
  
  get tasksFormArray(){
    return this.todoForm.controls["tasks"] as FormArray;
  }
  
  constructor( 
    @Inject(DIALOG_DATA) public data: string, 
    private _fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _todoService: TodoService,
    private _taskService: TaskService,
    public dialogRef: MatDialogRef<TodoDialogComponent>
  ) {
    this.refreshTodoDetailsData(data);
  }

  @HostListener('window:keyup', ['$event']) 
  keyEvent(event: KeyboardEvent){
    if(event.code === 'Enter') this.submitTask(this.todo.id);
  }

  refreshTodoDetailsData(todoId: string){
    this._todoService
      .GetTodoDetails(todoId)
      .pipe(
        map(todoDetails => { 
          this.todo = todoDetails;
          this.initiTodoForm(todoDetails); 
        }),
        catchError((error: HttpErrorResponse) => {
          this.openSnackBar(error.message)
          return of(0);
        })
      )
      .subscribe();
  }
  async onChangeTask({id, isCompleted}: TaskModel){
    
    this._taskService.UpdateStatus({
      taskId: id,
      isCompleted: isCompleted
    })
    .pipe(
      catchError((error: HttpErrorResponse) => {
        this.openSnackBar(error.message)
        return of(0);
      })
    )
    .subscribe();
  }
  
  //INICIALIZA O TODOFORM COM OS DADOS E SEUS CONTROLS ASSIM COMO FORMARRY DE TASKS
  initiTodoForm(todo: Todo){
    this.todoForm = this._fb.group({
      id: new FormControl(todo.id),
      title: new FormControl(todo.title),
      description: new FormControl(todo.description),
      tasks: new FormArray([]),
      floatLabel: this.floatLabelControl
    });

    of(this.todo.tasks).subscribe(task => {
      this.todo.tasks = task;
      this.addTasks();
    });
  }

  private addTasks(){
    if(this.todo.tasks.length > 0){
      this.todo.tasks.map((value) => this.tasksFormArray.push(new FormControl(value)))
    }
  }

  //CONTROLA O LABEL FLUTUANTE DO INPUT
  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value || 'auto';
  }

  //CHAMA ROTA PRA ATUALIZAR O DADO DO TODO E TASKS.
  onSubmit(){
    let todoId = this.todoForm.controls["id"].value;

    const param = {
      title: this.todoForm.controls["title"].value,
      description: this.todoForm.controls["description"].value
    } as UpdateTodoDTO

    this._todoService.Update(todoId, param)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        this.openSnackBar(error.message)
        return of(0);
      })
    )
    .subscribe( () => {
        this.openSnackBar("Todo Atualizado com sucesso");
        this.dialogRef.close(true);
      }
    );
  }

  onCancel(){
    this.todoForm.reset();
  }

  insertNewTask(element: HTMLInputElement){
    this.hideTaskField = true;
    setTimeout(() => {
      element.focus();
    }, 0);
  }

  resetTaskField(){
    this.taskForm.reset();
    this.hideTaskField = false;
  }

  submitTask(todoId: string){
    if(!this.taskForm.valid){
      this._snackBar.open(  'Existem campos obrigatórios nao preenchidos.', 'Close', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
      return;     
    }
    
    const taskData = {
      todoId: todoId,
      taskTitle: this.taskForm.controls['title'].value
    } as TaskDto

    this._taskService
      .CreateTask(taskData)
      .pipe(
        map(task => { 
          this.refreshTodoDetailsData(this.todo.id);
          this.hideTaskField = false;

        }),
        catchError((error: HttpErrorResponse) => {
          this.openSnackBar(error.message)
          return of(0);
        })
      )
      .subscribe();
  }

  onHoverTask(i: number){
    this.deleteTaskOption = i;
  }

  onClickDeleteTask(taskId: string){
    this._taskService.DeleteTask(taskId)
    .pipe(
      map( result => {
        this.refreshTodoDetailsData(this.todo.id);
      }),
      catchError((error: HttpErrorResponse) => {
        this.openSnackBar(error.message)
        return of(0);
      })
    )
    .subscribe();
  }

  //COMPLEMENTARY METHODS
  openSnackBar(message: string) {
    this._snackBar.open(message, 'Close', {
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
  }

  hasTasks(): boolean {
    if (this.todo === null) return false;
    if (this.todo === undefined) return false;
    if (this.todo.tasks.length === 0) return false;
    return true;
  }
}