import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VaccineService {
  private apiUrl = 'http://localhost:5101/api/vaccines'; // URL API Backend

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Lấy token từ LocalStorage
    if (!token) {
      throw new Error('Không có quyền truy cập!');
    }

    return new HttpHeaders({
      Authorization: `Bearer ${token}`, // Đính kèm token vào header
    });
  }

  getVaccines(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  addVaccine(vaccine: any): Observable<any> {
    return this.http.post(this.apiUrl, vaccine, { headers: this.getHeaders() });
  }

  updateVaccine(id: number, vaccine: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, vaccine, { headers: this.getHeaders() });
  }

  deleteVaccine(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
      responseType: 'text', // Chấp nhận phản hồi dạng chuỗi
    });
  }
  
}
