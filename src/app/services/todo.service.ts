import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import {  Todo, TodoChangeUserDto, TodoDto, TodosUsersResponseViewModel, UpdateTodoDTO } from '../todo/interfaces/todo.interface';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private readonly url: string = 'https://localhost:7233/v1/todo'
 
  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }; 

  constructor(public _http: HttpClient) { }

  public GetTodoByUser(): Observable<TodosUsersResponseViewModel[]>{
    return this._http.get<TodosUsersResponseViewModel[]>(this.url + '/todobyuser')
      .pipe(
        catchError(this.handleError)
      );
  }
  
  public GetTodoDetails(todoId: string): Observable<Todo>{
    return this._http.get<Todo>(this.url + `/${todoId}`)
    .pipe(
      catchError(this.handleError)
    );
  }

  public CreateTodo(todo: TodoDto){
    return this._http.post(this.url, todo)
    .pipe(
      catchError(this.handleError)
    );
  }

  public DeleteTodo(todoId: string){
    return this._http.delete(this.url + `/${todoId}`)
    .pipe(
      catchError(this.handleError)
    );
  }

  public Update(todoId: string, param: UpdateTodoDTO){
    return this._http.patch<void>(this.url + `/${todoId}`, param)
    .pipe(
      catchError(this.handleError)
    );
  }



  public ChangeTodoUser(todoId: string, param: TodoChangeUserDto){
    return this._http.put(this.url + `/changetodouser/${todoId}`, param, this.httpOptions )
    .pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('Ocorreu um erro:', error.error);
    } else {
      console.error(
        `Servidor retornou o seguinte status: ${error.status}, com a mensagem: `, error.error);
    }
    return throwError(() => new Error('Alguma coisa aconteceu de errado, por favor contate o Administrador do sistema.'));
  }

}
