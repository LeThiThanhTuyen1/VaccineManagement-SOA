import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  private apiUrl = 'http://localhost:5102/api/registrations'; // API URL

  constructor(private http: HttpClient) { }

  // Function to register a new vaccination
  registerVaccination(vaccination: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,  // Token Authorization Header
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.apiUrl}/register`, vaccination, { headers })
      .pipe(
        catchError(this.handleError)
      );
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
