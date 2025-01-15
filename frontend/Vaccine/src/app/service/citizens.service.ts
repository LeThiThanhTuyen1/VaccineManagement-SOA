import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Citizen } from '../model/citizen.model';

@Injectable({
  providedIn: 'root'
})
export class CitizensService {
  private apiUrl = 'http://localhost:5103/api/citizens'

  constructor(private http: HttpClient) { }

   // Fetch the list of citizens
   getCitizens(): Observable<Citizen[]> {
    return this.http.get<Citizen[]>(this.apiUrl);
  }

  // Fetch citizen by id
  getCitizenById(id: number): Observable<Citizen> {
    return this.http.get<Citizen>(`${this.apiUrl}/${id}`);
  }

  // Add a new citizen
  addCitizen(citizen: Citizen): Observable<Citizen> {
    return this.http.post<Citizen>(this.apiUrl, citizen);
  }

  deleteCitizen(citizenId: number) {
    return this.http.delete(`${this.apiUrl}/${citizenId}`);
  }
  
  // Update an existing citizen
  updateCitizen(id: number, citizen: Citizen): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, citizen);
  }
}
