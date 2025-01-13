import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CitizensService {
  private citizenApiUrl = 'http://localhost:5103/api/citizens'

  constructor(private http: HttpClient) { }

  // Fetch the list of citizens
  getCitizens(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(this.citizenApiUrl, { headers });
  }

}
