import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5100/api/users'; // URL for the users API

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Method to get the list of users
  getUsers(): Observable<any> {
    const token = this.authService.getToken(); // Retrieve the token from AuthService
    if (!token) {
      throw new Error('Token is not available. Please log in.');
    }

    const headers = this.createAuthHeaders(token);

    return this.http.get(this.apiUrl, { headers });
  }

  // Activate user account
  activateUser(userId: number): Observable<any> {
    const token = this.authService.getToken(); // Retrieve the token from AuthService
    if (!token) {
      throw new Error('Token is not available. Please log in.');
    }

    const headers = this.createAuthHeaders(token);

    return this.http.put(`${this.apiUrl}/activate/${userId}`, {}, { headers })
      .pipe(catchError(this.handleError)); // Handle errors
  }

  // Deactivate user account
  deactivateUser(userId: number): Observable<any> {
    const token = this.authService.getToken(); // Retrieve the token from AuthService
    if (!token) {
      throw new Error('Token is not available. Please log in.');
    }

    const headers = this.createAuthHeaders(token);

    return this.http.put(`${this.apiUrl}/deactivate/${userId}`, {}, { headers })
      .pipe(catchError(this.handleError)); // Handle errors
  }

  // Register new user
  register(user: { username: string, password: string, role: string }): Observable<any> {
    const token = this.authService.getToken(); // Retrieve the token from AuthService
    if (!token) {
      throw new Error('Token is not available. Please log in.');
    }

    const headers = this.createAuthHeaders(token);

    return this.http.post(`${this.apiUrl}/register`, user, { headers })
      .pipe(catchError(this.handleError)); // Handle errors
  }

  // Search users by username
  searchUsers(username: string): Observable<any> {
    const token = this.authService.getToken(); // Retrieve the token from AuthService
    if (!token) {
      throw new Error('Token is not available. Please log in.');
    }

    const headers = this.createAuthHeaders(token);

    return this.http.get(`${this.apiUrl}/search?username=${username}`, { headers });
  }

  // Private helper method to create headers with authorization token
  private createAuthHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // Handle errors from the API
  private handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side errors
      switch (error.status) {
        case 400:
          errorMessage = 'Bad Request: The request is invalid.';
          break;
        case 401:
          errorMessage = 'Unauthorized: Please login.';
          break;
        case 403:
          errorMessage = 'Forbidden: You do not have permission to perform this action.';
          break;
        case 500:
          errorMessage = 'Internal Server Error: Please try again later.';
          break;
        default:
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }
    return throwError(() => new Error(errorMessage));
  }
}
