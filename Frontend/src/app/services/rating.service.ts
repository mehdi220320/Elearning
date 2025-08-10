import { Injectable } from '@angular/core';
import {environment} from '../models/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Rating} from '../models/Rating';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private apiUrl = environment.apiUrl+'rate/';

  constructor(private http: HttpClient) { }
  addCourse(rateData:any):Observable<any>{
    return this.http.post(this.apiUrl+'addCourse',rateData)
  }
  getByCourse(id:any):Observable<Rating[]>{
    return this.http.get<Rating[]>(this.apiUrl+'course/'+id)
  }
  addFormateur(rateData:any):Observable<any>{
    return this.http.post(this.apiUrl+'addFormateur',rateData)
  }
  getByformateur(id:any):Observable<Rating[]>{
    return this.http.get<Rating[]>(this.apiUrl+'formateur/'+id)
  }
}
