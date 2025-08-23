import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../models/environment';
import {HttpClient} from '@angular/common/http';
import {Hackathon} from '../models/Hackathon';

@Injectable({
  providedIn: 'root'
})
export class HackathonService {
  private apiUrl = environment.apiUrl+'hackathon/';
  constructor(private http: HttpClient) {}
  add(data:any):Observable<any>{
    return this.http.post(this.apiUrl+"add",data)
  }
  getAll():Observable<Hackathon[]>{
    return this.http.get<Hackathon[]>(this.apiUrl+"all")
  }
  getById(id:any):Observable<Hackathon>{
    return this.http.get<Hackathon>(this.apiUrl+id)
  }
  addParticipants(hackathonId:any,userId:any):Observable<any>{
    return this.http.post(this.apiUrl+hackathonId+"/participants/"+userId,{})
  }
  removeParticipants(hackathonId:any,userId:any):Observable<any>{
    return this.http.delete(this.apiUrl+hackathonId+"/participants/"+userId)
  }
}
