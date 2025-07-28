import { Injectable } from '@angular/core';
import {environment} from '../models/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Category} from '../models/Category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = environment.apiUrl+'category/';

  constructor(private http: HttpClient) {}

  addCategory(name:any):Observable<any>{
    return this.http.post(this.apiUrl+"addcategory", {name:name})
  }
  getAll():Observable<Category[]>{
    return this.http.get<Category[]>(this.apiUrl+"all")
  }
}
