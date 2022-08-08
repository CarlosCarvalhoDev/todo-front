import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, map, of } from 'rxjs';
import { AddTodoDialogComponent } from '../components/add-todo-dialog/add-todo-dialog.component';
import { AddUserDialogComponent } from '../components/add-user-dialog/add-user-dialog.component';
import { TodoDialogComponent } from '../components/todo-dialog/todo-dialog.component';
import { NotificationService } from '../services/notification.service';
import { TodoService } from '../services/todo.service';
import { UserService } from '../services/user.service';
import { TodoChangeUserDto, TodoSumary, TodoUser } from './interfaces/todo.interface';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {
  todosByUser: TodoUser[] = [];

  constructor(
    private _dialog: MatDialog, 
    private _todoService: TodoService, 
    private _snackBar: MatSnackBar,
    private _userService: UserService,
    private _notificationService: NotificationService 
    ) { }

  ngOnInit(): void {
    this.RefreshDataTodo();
  }

  RefreshDataTodo(){
    this._todoService.GetTodoByUser()
    .pipe(
      map( todo => {
        this.todosByUser = todo;
      }),
      catchError((error: HttpErrorResponse) => {
        this._notificationService.error({message: error.message});
        return of(0);
      })
    )
    .subscribe();
  }

  drop(event: CdkDragDrop<TodoSumary[]>, userId: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } 
    else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      var todoId = event.container.data[0].id;
      this.UpdateTodo(todoId, userId);
    }
  }

  UpdateTodo(todoId: string, userId: string){
    const param = {
      userId: userId
    } as TodoChangeUserDto

    this._todoService.ChangeTodoUser(todoId, param)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        this._notificationService.error({message: error.message})
        return of(0);
      })
    )
    .subscribe(value => {
      if(value){
        this.RefreshDataTodo();
        return;
      }
    });
  }

  deleteTodo(todoId: string){
    this._todoService.DeleteTodo(todoId)
    .pipe(
      map(() => {
        this.RefreshDataTodo();
        this._notificationService.success({message: 'Todo has been successfully deleted'});
      }),
      catchError((error: HttpErrorResponse) => {
        this._notificationService.error({message: error.message});
        return of(0);
      })
    )
    .subscribe();
  }

  removeUser(userId: string){
    this._userService.DeleteUser(userId)
    .pipe(
      map( () => {
        this.RefreshDataTodo();
        this._notificationService.success({message: 'User has been successfully deleted'})
      }),
      catchError((error: HttpErrorResponse) => {
        this._notificationService.error({message: error.message});
        return of(0);
      })
    )
    .subscribe();
  }

  openAddUserDialog(){
    const dialogRef = this._dialog.open(AddUserDialogComponent, {
      width: '700px',
    })
    dialogRef.afterClosed().subscribe(
      data => {
        if(data){
          this.RefreshDataTodo();
        }
      }
    )
  }

  openTodoDialog(id: string) {
    const dialogRef = this._dialog.open(TodoDialogComponent, {
      width: '700px',
      data: id,
    });
    dialogRef.afterClosed().subscribe(
      data => {
        if(data){
          this.RefreshDataTodo();
        }
      }
    )
  }

  openAddTodoDialog(userId: string){
    const dialogRef = this._dialog.open(AddTodoDialogComponent, {
      width: '700px',
      data: userId,
    });
    dialogRef.afterClosed().subscribe(
      data => {
        if(data){
          this.RefreshDataTodo();
        }
      }
    )
  }
}

