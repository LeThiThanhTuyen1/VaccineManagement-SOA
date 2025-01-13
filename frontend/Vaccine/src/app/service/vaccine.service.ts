import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VaccineService {
  private API_URL = 'http://localhost:5101/api/vaccines';

  constructor(private http: HttpClient) { }

  // getVaccines(): Observable<any> {
  //   return this.http.get(`${API_URL}`);
  // }

  // Fetch the list of vaccines
  getVaccines(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(this.API_URL, { headers });
  }

  // getVaccineById(id: number): Observable<any> {
  //   return this.http.get(`${API_URL}/${id}`);
  // }

  // addVaccine(vaccine: any): Observable<any> {
  //   return this.http.post(API_URL, vaccine);
  // }

  // updateVaccine(id: number, vaccine: any): Observable<any> {
  //   return this.http.put(`${API_URL}/${id}`, vaccine);
  // }

  // deleteVaccine(id: number): Observable<any> {
  //   return this.http.delete(`${API_URL}/${id}`);
  // }

  // addVaccineDetail(id: number, detail: any): Observable<any> {
  //   return this.http.post(`${API_URL}/${id}/details`, detail);
  // }

  // deleteVaccineDetail(id: number, detailId: number): Observable<any> {
  //   return this.http.delete(`${API_URL}/${id}/details/${detailId}`);
  // }
}
