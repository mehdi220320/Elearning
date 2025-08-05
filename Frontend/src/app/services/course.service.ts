import { Injectable } from '@angular/core';
import {environment} from '../models/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Course} from '../models/Course';
import {Category} from '../models/Category';

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
  isArchive(id:any):Observable<any>{
    return this.http.put(this.apiUrl+"isArchive/"+id,{})
  }
  getByInstructorId(id:any):Observable<Course[]>{
    return this.http.get<any>(this.apiUrl+"instructor/"+id)
  }
  getById(id:any):Observable<Course>{
    return this.http.get<any>(this.apiUrl+id)
  }
  getCoursesByCategorie(categorie:any):Observable<any>{
    return this.http.get<any>(this.apiUrl+"category/"+ categorie)
  }
}
