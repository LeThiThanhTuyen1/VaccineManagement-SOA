import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5100/api/users/login'; // API login

  constructor(private http: HttpClient) { }

  // Hàm đăng nhập
  login(username: string, password: string): Observable<any> {
    const body = { username, password };
    return this.http.post(this.apiUrl, body);
  }

  // Hàm lưu token vào localStorage
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Hàm lấy token từ localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Hàm kiểm tra người dùng đã đăng nhập hay chưa
  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  // Tạo header chứa token
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();
  }

  // Hàm đăng xuất
  logout(): void {
    localStorage.removeItem('token');
  }
}
