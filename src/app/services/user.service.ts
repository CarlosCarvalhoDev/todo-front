import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { UserResponseViewModel, UserDto } from '../todo/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly url: string = 'https://localhost:7233/v1/user';; 
  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }; 

  constructor(private http: HttpClient) {
  }

  public GetUsers(): Observable<UserResponseViewModel[]>{
    return this.http.get<UserResponseViewModel[]>(this.url)
    .pipe(
      catchError(this.handleError)
    );
  }

  public GetUserById(id: string): Observable<UserResponseViewModel>{
    return this.http.get<UserResponseViewModel>(`${this.url}/${id}`)
    .pipe(
      catchError(this.handleError)
    );
  }

  public CreateUser(user: UserDto): Observable<UserResponseViewModel> {
    return this.http.post<UserResponseViewModel>(this.url, user, this.httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }

  public DeleteUser(userId: string){
    return this.http.delete(this.url + `/${userId}`)
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
