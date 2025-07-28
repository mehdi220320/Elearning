import { Injectable } from '@angular/core';
import {environment} from '../models/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = environment.apiUrl+'course/';
  constructor(private http: HttpClient) {}

  getAll():Observable<any>{
    return this.http.get<any>(this.apiUrl+"all")
  }
  add(data:any):Observable<any>{
    return this.http.post(this.apiUrl+"add",data)
  }
}
