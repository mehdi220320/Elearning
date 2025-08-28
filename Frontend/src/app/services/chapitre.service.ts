import { Injectable } from '@angular/core';
import {environment} from '../models/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Chapitre} from '../models/Chapitres';
import {Comment} from '../models/Comment';

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
  getChaptersByCourse(id:any):Observable<Chapitre[]>{
    return this.http.get<Chapitre[]>(this.apiUrl+"course/"+id);
  }
  getdureeVideosByCourse(id:any):Observable<number>{
    return this.http.get<number>(this.apiUrl+"course/dureeVideos/"+id);
  }
  getnbDocummentsByCourse(id:any):Observable<number>{
    return this.http.get<number>(this.apiUrl+"course/nbDocumments/"+id);
  }
  addComment(userId:any,chapterId:any,description:any):Observable<Comment>{
    return this.http.post<Comment>(this.apiUrl+"comments/add", {userId,chapterId,description})
  }
  addLikes(userId:any,commentId:any):Observable<any>{
    return this.http.post(this.apiUrl+"comments/addLike", {userId,commentId})
  }
  removeLikes(userId:any,commentId:any):Observable<any>{
    return this.http.delete(this.apiUrl+"comments/removeLike/"+userId+"/"+commentId, )
  }
  getCommentsByCHapterId(chapterId:any):Observable<Comment[]>{
    return this.http.get<Comment[]>(this.apiUrl+"comments/chapter/"+chapterId);
  }
  deleteComment(commentId:any):Observable<any>{
    return this.http.delete(this.apiUrl+"comments/delete/"+commentId, )
  }
}
