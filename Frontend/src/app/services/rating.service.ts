import { Injectable } from '@angular/core';
import {environment} from '../models/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private apiUrl = environment.apiUrl+'rate/';

  constructor(private http: HttpClient) { }
  addCourse(rateData:any):Observable<any>{
    return this.http.post(this.apiUrl+'addCourse',rateData)
  }

}
