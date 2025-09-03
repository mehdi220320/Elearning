import { Injectable } from '@angular/core';
import {environment} from '../models/environment';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable} from 'rxjs';
import {Reclamation} from '../models/Reclamation';

@Injectable({
  providedIn: 'root'
})
export class ReclamationService {
  private apiUrl = environment.apiUrl+'reclamation/';

  constructor(private http: HttpClient) {}

  add(data:any):Observable<any>{
    return this.http.post(this.apiUrl+"add", data)
  }
  getAll():Observable<Reclamation[]>{
    return this.http.get<Reclamation[]>(this.apiUrl+"all")
  }
  newest():Observable<Reclamation[]>{
    return this.http.get<Reclamation[]>(this.apiUrl+"newest")
  }
  getById(id:any):Observable<any>{
    return this.http.get<any>(this.apiUrl+id)
  }
  markerSeen(id:any):Observable<any>{
    return this.http.post<any>(this.apiUrl+"seen/"+id,{})
  }

  numberOfReclamations(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}numberOfReclamations`)
  }

}
