import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5100/api/users';
  constructor(private http: HttpClient, private authService: AuthService) { }

  // Lấy danh sách người dùng
  getUsers(): Observable<any> {
    const token = localStorage.getItem('token'); // Lấy token từ LocalStorage
    if (!token) {
      throw new Error('Token is not available. Please log in.');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Đính kèm token vào header
    });

    return this.http.get(this.apiUrl, { headers });
  }
}
