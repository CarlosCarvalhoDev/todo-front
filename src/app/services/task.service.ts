import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { TaskDto, TaskModel, UpdateStatusTaskDTO } from '../todo/interfaces/task.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private readonly url: string = 'https://localhost:7233/v1/task'

  constructor(private _http: HttpClient) { }

  CreateTask(task: TaskDto){
    return this._http.post(this.url, task)
    .pipe(
      catchError(this.handleError)
    );
  }

  DeleteTask(taskId: string){
    return this._http.delete(this.url + `/${taskId}`)
    .pipe(
      catchError(this.handleError)
    );
  }

  UpdateStatus(taskStatusDto: UpdateStatusTaskDTO){
    return this._http.post(this.url + '/updatestatus', taskStatusDto )
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
