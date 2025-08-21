import { Component } from '@angular/core';
import {Course} from '../models/Course';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {CourseService} from '../services/course.service';
import {DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import {Chapitre} from '../models/Chapitres';
import {ChapitreService} from '../services/chapitre.service';
import {TestService} from '../services/test.service';
import {AuthService} from '../services/authServices/auth.service';

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
              private testService:TestService,
              private authService:AuthService,
              private sanitizer:DomSanitizer) {}
  tests:any=[]
  numberTest=2;
  testsPagination:any=[]
  loadTests(id:any): void {
    this.tests=[]
    this.testService.getAllTestsByChapter(id).subscribe({
      next: (response) => {
        this.tests = response.data.tests;
        this.testsPagination=this.tests.slice(0,this.numberTest)
      },
      error: (err) => {
        console.error('Erreur lors du chargement des tests', err);
      }
    });
  }

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
          this.loadTests(this.chapters[0]._id)
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
    this.loadTests(this.chapters[this.currentChapterIndex]._id)

  }

  nextChapter(): void {
    if (this.currentChapterIndex < this.chapters.length - 1) {
      this.currentChapterIndex++;
    }
    this.loadTests(this.chapters[this.currentChapterIndex]._id)

  }
  afficherPlus(){
    this.numberTest+=3;
    this.testsPagination=this.tests.slice(0,this.numberTest)
  }
  goToChapter(index: number): void {
    if (index >= 0 && index < this.chapters.length) {
      this.currentChapterIndex = index;
    }
    this.loadTests(this.chapters[this.currentChapterIndex]._id)

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

  lastScore(results: any[]) :any{

    const userResultItems = results.filter(x =>
      x.user._id === this.authService.getUserId() &&
      x.completedAt
    );

    if (userResultItems.length === 0) return null;

    return userResultItems.reduce((latest, current) => {
      return new Date(current.completedAt) > new Date(latest.completedAt) ? current : latest;
    });

  }

}
