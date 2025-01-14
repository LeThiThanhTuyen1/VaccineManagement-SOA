import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WardService {

  private apiUrl = 'http://localhost:5103/api/wards';  // Backend API URL for wards

  constructor(private http: HttpClient) {}

  getWardsByDistrict(districtId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${districtId}/wards`);
  }
  
}
