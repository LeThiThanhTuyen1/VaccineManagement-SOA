import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  private apiUrl = 'http://localhost:5102/api/registrations'; 

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Lấy danh sách đăng ký
  getRegistrations(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all-with-details`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Đăng ký mới
  registerVaccination(vaccination: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, vaccination)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Hoàn thành đăng ký
  completeVaccination(registrationId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${registrationId}/complete`, {})
      .pipe(
        catchError(this.handleError)
      );
  }

  // Hủy đăng ký
  cancelVaccination(registrationId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${registrationId}/cancel`, {})
      .pipe(
        catchError(this.handleError)
      );
  }

  // Xử lý lỗi (Client-side và Server-side)
  private handleError(error: any): Observable<never> {
    const errorMessage = error.error instanceof ErrorEvent 
      ? `Client-side error: ${error.error.message}` 
      : `Server-side error: ${error.status} - ${error.message}`;
    
    return throwError(() => new Error(errorMessage));
  }
}
