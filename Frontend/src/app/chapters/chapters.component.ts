import {Component, OnInit} from '@angular/core';
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
        }
      },
      error: (err) => { console.error(err); }
    });
  }

  ngOnInit() {
    window.scrollTo({ top: 0, behavior: 'instant' });
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

  previousChapitre(): void {
    if (this.currentChapitreIndex > 0) {
      this.currentChapitreIndex--;
      this.currentSectionIndex = 0;
      this.showPdfViewer = false;
      this.loadTests(this.chapitres[this.currentChapitreIndex]._id);
    }
  }

  nextChapitre(): void {
    if (this.currentChapitreIndex < this.chapitres.length - 1) {
      this.currentChapitreIndex++;
      this.currentSectionIndex = 0;
      this.showPdfViewer = false;
      this.loadTests(this.chapitres[this.currentChapitreIndex]._id);
    }
  }

  previousSection(): void {
    if (this.currentSectionIndex > 0) {
      this.currentSectionIndex--;
      this.showPdfViewer = false;
    }
  }

  nextSection(): void {
    const currentChapitre = this.chapitres[this.currentChapitreIndex];
    if (this.currentSectionIndex < currentChapitre.section.length - 1) {
      this.currentSectionIndex++;
      this.showPdfViewer = false;
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


  // goToSection(chapitreIndex: number, sectionIndex: number): void {
  //   if (chapitreIndex >= 0 && chapitreIndex < this.chapitres.length) {
  //     this.currentChapitreIndex = chapitreIndex;
  //     const chapitre = this.chapitres[chapitreIndex];
  //     if (sectionIndex >= 0 && sectionIndex < chapitre.section.length) {
  //       this.currentSectionIndex = sectionIndex;
  //       this.showPdfViewer = false;
  //     }
  //   }
  // }

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
  //
  // getCurrentSection() {
  //   if (this.chapitres.length > 0 &&
  //     this.chapitres[this.currentChapitreIndex].section.length > 0 &&
  //     this.currentSectionIndex < this.chapitres[this.currentChapitreIndex].section.length) {
  //     return this.chapitres[this.currentChapitreIndex].section[this.currentSectionIndex];
  //   }
  //   return null;
  // }
  //
  // getTotalSections(): number {
  //   if (this.chapitres.length === 0) return 0;
  //   return this.chapitres.reduce((total, chapitre) => total + chapitre.section.length, 0);
  // }
  //
  // getCompletedSections(): number {
  //   return this.currentChapitreIndex * 3 + this.currentSectionIndex + 1;
  // }
  currentPdfName:string="";
  // Nouvelle fonction pour ouvrir le lecteur PDF
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
}
