import { Injectable } from '@angular/core';
import {environment} from '../models/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Chapitre} from '../models/Chapitres';

@Injectable({
  providedIn: 'root'
})
export class ChapitreService {
  private apiUrl = environment.apiUrl+'chapitre/';

  constructor(private http: HttpClient) {}

  add(form:any):Observable<any>{
    return this.http.post(this.apiUrl+"add",form)
  }
  getAll():Observable<Chapitre[]>{
    return this.http.get<Chapitre[]>(this.apiUrl+"all");
  }
  getChaptersWithRessouces():Observable<Chapitre[]>{
    return this.http.get<Chapitre[]>(this.apiUrl+"ressources");
  }
  getChaptersWithMedia():Observable<Chapitre[]>{
    return this.http.get<Chapitre[]>(this.apiUrl+"medias");
  }
}
