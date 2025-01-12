import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:5101/api/vaccines';
@Injectable({
  providedIn: 'root'
})
export class VaccineService {

  constructor(private http: HttpClient) { }

  getVaccines(): Observable<any> {
    return this.http.get(`${API_URL}`);
  }

  getVaccineById(id: number): Observable<any> {
    return this.http.get(`${API_URL}/${id}`);
  }

  addVaccine(vaccine: any): Observable<any> {
    return this.http.post(API_URL, vaccine);
  }

  updateVaccine(id: number, vaccine: any): Observable<any> {
    return this.http.put(`${API_URL}/${id}`, vaccine);
  }

  deleteVaccine(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/${id}`);
  }

  addVaccineDetail(id: number, detail: any): Observable<any> {
    return this.http.post(`${API_URL}/${id}/details`, detail);
  }

  deleteVaccineDetail(id: number, detailId: number): Observable<any> {
    return this.http.delete(`${API_URL}/${id}/details/${detailId}`);
  }
}
