import {Component, OnInit} from '@angular/core';
import {Course} from '../models/Course';
import {Comment} from '../models/Comment';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {CourseService} from '../services/course.service';
import {DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import {Chapitre} from '../models/Chapitres';
import {ChapitreService} from '../services/chapitre.service';
import {TestService} from '../services/test.service';
import {AuthService} from '../services/authServices/auth.service';
import { formatDistanceToNow } from 'date-fns';

@Component({
  selector: 'app-chapters',
  standalone: false,
  templateUrl: './chapters.component.html',
  styleUrl: './chapters.component.css'
})
export class ChaptersComponent implements OnInit {
  courseId: string = "";
  course: Course = {
    _id: "",
    title: "",
    coverImage: {
      path: "",
      contentType: "",
    },
    description: "",
    formateur: {
      _id: "",
      firstname: "",
      lastname: "",
    },
    categorie: {
      _id: "",
      name: "",
    },
    status: false,
    prix: 0,
    description_detaillee: "",
    niveau: "",
    duree: "",
    langue: "",
    certificat: false,
    rating: 0,
    createdAt: "",
    learns: []
  };

  chapitres: Chapitre[] = [];
  currentChapitreIndex: number = 0;
  currentSectionIndex: number = 0;
  showPdfViewer: boolean = false;
  currentPdfUrl: SafeUrl = '';
  userPicture:string | null="";
  tests: any[] = [];
  numberTest = 2;
  testsPagination: any[] = [];

  constructor(
    private router: Router,
    private location: Location,
    private courseService: CourseService,
    private route: ActivatedRoute,
    private chapterService: ChapitreService,
    private testService: TestService,
    private authService: AuthService,
    private sanitizer: DomSanitizer
  ) {}

  loadTests(id: any): void {
    this.tests = [];
    this.testService.getAllTestsByChapter(id).subscribe({
      next: (response) => {
        this.tests = response.data.tests;
        this.testsPagination = this.tests.slice(0, this.numberTest);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des tests', err);
      }
    });
  }

  loadData() {
    this.courseId = this.route.snapshot.paramMap.get('id') || "";
    this.courseService.getById(this.courseId).subscribe({
      next: (response) => {
        this.course = response;
      },
      error: (err) => { console.error(err); }
    });

    this.chapterService.getChaptersByCourse(this.courseId).subscribe({
      next: (response) => {
        this.chapitres = response;
        if (this.chapitres.length > 0 && this.chapitres[0].section.length > 0) {
          this.loadTests(this.chapitres[0]._id);
          this.loadComments()
        }
      },
      error: (err) => { console.error(err); }
    });
  }

  ngOnInit() {
    window.scrollTo({ top: 0, behavior: 'instant' });
    this.userPicture=this.authService.getUserPicture()
    this.loadData();
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




  afficherPlus() {
    this.numberTest += 3;
    this.testsPagination = this.tests.slice(0, this.numberTest);
  }

  goToChapitre(index: number): void {
    if (index >= 0 && index < this.chapitres.length) {
      this.currentChapitreIndex = index;
      this.currentSectionIndex = 0;
      this.showPdfViewer = false;
      this.loadTests(this.chapitres[this.currentChapitreIndex]._id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

  }



  playVideo(url: any): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
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

  lastScore(results: any[]): any {
    const userResultItems = results.filter(x =>
      x.user._id === this.authService.getUserId() &&
      x.completedAt
    );

    if (userResultItems.length === 0) return null;

    return userResultItems.reduce((latest, current) => {
      return new Date(current.completedAt) > new Date(latest.completedAt) ? current : latest;
    });
  }

  currentPdfName:string="";
  openPdfViewer(filePath: string,fileName:string): void {
    this.currentPdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(filePath);
    this.currentPdfName=fileName;
    this.showPdfViewer = true;
  }

  // Nouvelle fonction pour fermer le lecteur PDF
  closePdfViewer(): void {
    this.showPdfViewer = false;
    this.currentPdfUrl = "";
    this.currentPdfName="";
  }
  description:string="";
  comments:Comment[]=[]
  addComment(){
    if(this.description!==""){
      this.chapterService.addComment(this.authService.getUserId(),this.chapitres[this.currentChapitreIndex]._id,this.description).subscribe({
        next:(response)=>{this.loadComments();this.description=""},
        error:(err)=>console.error(err)
      })
    }
  }
  addLike(commentId: any) {
    this.chapterService.addLikes(this.authService.getUserId(), commentId).subscribe({
      next: (response) => {
        this.comments.forEach((x: Comment) => {
          if (x._id === commentId ) {
            x.likes.push(this.authService.getUserId());
          }
        });
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  removeLike(commentId: any) {
    this.chapterService.removeLikes(this.authService.getUserId(), commentId).subscribe({
      next: (response) => {
        const userId = this.authService.getUserId();
        this.comments.forEach((x: Comment) => {
          if (x._id === commentId) {
            x.likes = x.likes.filter((like: any) => like !== userId);
          }
        });
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  pressedAllComments=false;
  commentsPagination:Comment[]=[]
  VoirAllComment(){
    this.pressedAllComments=true
    this.commentsPagination=this.comments
    this.loadComments()
  }
  loadComments() {
    this.chapterService.getCommentsByCHapterId(this.chapitres[this.currentChapitreIndex]._id).subscribe({
      next: (response) => {
        this.comments = response.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        if(!this.pressedAllComments){
          this.commentsPagination = this.comments.slice(0, 2);
        }else{
          this.commentsPagination = this.comments;

        }
      },
      error: (err) => console.error(err)
    });
  }  getImageUser(url: string  | null): SafeUrl | string {
    return url ?
      this.sanitizer.bypassSecurityTrustResourceUrl(url) :
      '/assets/img.png';
  }
  getRelativeTime(date: string | Date): string {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  }
  isLike(likes:any):boolean{
    return likes.includes(this.authService.getUserId());
  }

  isCurrentUser(_id: any):boolean {
    return this.authService.getUserId()===_id
  }

  deleteComment(id: any) {
    this.chapterService.deleteComment(id).subscribe({
      next:(res)=>{this.loadComments()},
      error:(err)=>{console.error(err)}
    })
  }
}
