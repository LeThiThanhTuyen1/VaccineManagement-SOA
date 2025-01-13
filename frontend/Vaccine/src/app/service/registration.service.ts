import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  private apiUrl = 'http://localhost:5102/api/registrations'; // API URL

  constructor(private http: HttpClient, private authService: AuthService) { }

 // Phương thức gọi API lấy danh sách đăng ký
 getRegistrations(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/all-with-details`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
  // Function to register a new vaccination
  registerVaccination(vaccination: any, token: string): Observable<any> {
    const headers = this.createAuthHeaders(token);

    return this.http.post(`${this.apiUrl}/register`, vaccination, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Private helper method to create headers with authorization token
  private createAuthHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Error handler
  private handleError(error: any) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      errorMessage = `Server-side error: ${error.status} - ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
