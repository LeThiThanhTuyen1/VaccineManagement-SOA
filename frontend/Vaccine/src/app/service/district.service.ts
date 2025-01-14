import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DistrictService {

  private apiUrl = 'http://localhost:5103/api/districts';  // Backend API URL for districts

  constructor(private http: HttpClient) {}

  getDistrictsByProvince(provinceId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${provinceId}/district`);
  }
  
}
