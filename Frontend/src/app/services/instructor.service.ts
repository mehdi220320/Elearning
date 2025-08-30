import { Injectable } from '@angular/core';
import {environment} from '../models/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Instructor} from '../models/Instructor';

@Injectable({
  providedIn: 'root'
})
export class InstructorService {
  private apiUrl = environment.apiUrl+'instructor/';

  constructor(
    private http: HttpClient
  ) { }
  addInstructor(instructorData:any):Observable<any>{
    return this.http.post(this.apiUrl+"add",instructorData);
  }
  getAll():Observable<Instructor[]>{
    return this.http.get<Instructor[]>(this.apiUrl+"all")
  }
  getInstructorById(id:any):Observable<Instructor>{
    return this.http.get<Instructor>(this.apiUrl+id)
  }
  deleteById(id:string):Observable<any>{
    return this.http.delete(this.apiUrl+"delete/"+id)
  }
  updateInstructor(id: string, instructorData: any): Observable<any> {
    return this.http.put(this.apiUrl + "update/" + id, instructorData);
  }
}
