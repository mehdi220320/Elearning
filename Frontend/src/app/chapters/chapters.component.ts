import { Component } from '@angular/core';
import {Course} from '../models/Course';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {CourseService} from '../services/course.service';
import {InstructorService} from '../services/instructor.service';
import {DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import {Chapitre} from '../models/Chapitres';
import {ChapitreService} from '../services/chapitre.service';

@Component({
  selector: 'app-chapters',
  standalone: false,
  templateUrl: './chapters.component.html',
  styleUrl: './chapters.component.css'
})
export class ChaptersComponent {
  courseId:any=""
  course:Course= {
    _id: "",
    title: "",
    coverImage: {
      path: "",
      contentType: "",
    },
    description: "",
    formateur: {
      _id:"",
      firstname: "",
      lastname:"",
    },
    categorie: {
      _id: "",
      name: "",
    },
    status: false,
    prix:0,
    description_detaillee: "",
    niveau: "",
    duree:"",
    langue: "",
    certificat: false,
    rating:0,
    createdAt: "",
    learns:[]
  }
  chapters:Chapitre[]=[]
  constructor(private router:Router,
              private location: Location,
              private courseService:CourseService,
              private route:ActivatedRoute,
              private chapterService:ChapitreService,
              private sanitizer:DomSanitizer) {}
  loadData(){
    this.courseId = this.route.snapshot.paramMap.get('id') ;
    this.courseService.getById(this.courseId).subscribe(
      {
        next:(response)=>{
          this.course=response
        },error:(err)=>{console.error(err)}
      }
    )
    this.chapterService.getChaptersByCourse(this.courseId).subscribe(
      {
        next:(response)=>{
          this.chapters=response
        },error:(err)=>{console.error(err)}
      }
    )


  }
  ngOnInit(){
    this.loadData()
  }
  getImage(url: string | null): SafeUrl | string {
    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : '/assets/coverImage.png';
  }
  goBackOrFallback() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/admin/instructors']);
    }
  }
  currentChapterIndex: number = 0;

  previousChapter(): void {
    if (this.currentChapterIndex > 0) {
      this.currentChapterIndex--;
    }
  }

  nextChapter(): void {
    if (this.currentChapterIndex < this.chapters.length - 1) {
      this.currentChapterIndex++;
    }
  }

  goToChapter(index: number): void {
    if (index >= 0 && index < this.chapters.length) {
      this.currentChapterIndex = index;
    }
  }

  playVideo(url: any): SafeResourceUrl {
    return  this.sanitizer.bypassSecurityTrustResourceUrl(
      this.getEmbedUrl(url)
    );
  }
  private getEmbedUrl(url: string): string {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = this.extractYouTubeId(url);
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    return url;
  }
  private extractYouTubeId(url: string): string {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  }



}
