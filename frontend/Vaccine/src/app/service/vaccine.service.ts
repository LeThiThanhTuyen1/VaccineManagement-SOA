import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { Vaccine } from '../model/vaccine';

@Injectable({
  providedIn: 'root'
})
export class VaccineService {
  private API_URL = 'http://localhost:5101/api/vaccines';

  constructor(private http: HttpClient) {}

  // Lấy danh sách vaccine
  getVaccines(): Observable<any> {
    return this.http.get(`${this.API_URL}`).pipe(catchError(this.handleError));
  }

  // Lấy chi tiết vaccine theo ID
  getVaccineById(id: number): Observable<any> {
    return this.http.get(`${this.API_URL}/${id}`);
  }

  // Thêm mới vaccine
  addVaccine(vaccine: any): Observable<any> {
    return this.http.post(`${this.API_URL}`, vaccine);
  }

  // Cập nhật vaccine theo ID
  updateVaccine(vaccine: Vaccine): Observable<any> {
    const { details, ...vaccineData } = vaccine;

    const requestData = {
      ...vaccineData,
      details: details.map((detail) => ({
        ...detail,
        vaccine_id: vaccine.id,
      })),
    };

    return this.http.put(`${this.API_URL}/${vaccine.id}`, requestData).pipe(
      catchError(this.handleError)
    );
  }
  // Xóa vaccine theo ID
  deleteVaccine(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }

  // Tìm kiếm vaccine theo tên
  searchVaccines(name: string): Observable<any> {
    return this.http.get(`${this.API_URL}/search?name=${name}`);
  }

  // Xử lý lỗi
  private handleError(error: any) {
    const errorMessage = this.getErrorMessage(error);
    return throwError(() => new Error(errorMessage));
  }

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
