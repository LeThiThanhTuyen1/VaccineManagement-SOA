import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5100/api/users'; 

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Get the list of users
  getUsers(): Observable<any> {
    return this.http.get(this.apiUrl).pipe(catchError(this.handleError));
  }

  // Activate user account
  activateUser(userId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/activate/${userId}`, {}).pipe(catchError(this.handleError));
  }

  // Deactivate user account
  deactivateUser(userId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/deactivate/${userId}`, {}).pipe(catchError(this.handleError));
  }

  // Register new user
  register(user: { username: string, password: string, role: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user).pipe(catchError(this.handleError));
  }

  // Search users by username
  searchUsers(username: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/search?username=${username}`).pipe(catchError(this.handleError));
  }

  // Handle errors from the API
  private handleError(error: any) {
    const errorMessage = this.getErrorMessage(error);
    return throwError(() => new Error(errorMessage));
  }

  // Helper method to get error messages
  private getErrorMessage(error: any): string {
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      return `Client Error: ${error.error.message}`;
    } else {
      // Server-side errors
      switch (error.status) {
        case 400:
          return 'Bad Request: The request is invalid.';
        case 401:
          return 'Unauthorized: Please login.';
        case 403:
          return 'Forbidden: You do not have permission to perform this action.';
        case 500:
          return 'Internal Server Error: Please try again later.';
        default:
          return `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }
  }
}
