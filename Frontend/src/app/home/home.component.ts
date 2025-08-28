import { Component } from '@angular/core';
import {CourseService} from '../services/course.service';
import {Course} from '../models/Course';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {RatingService} from '../services/rating.service';
import {Rating} from '../models/Rating';
import {HackathonService} from '../services/hackathon.service';
import {Hackathon} from '../models/Hackathon';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  courses:Course[]=[]
  constructor(private coursService:CourseService,
              private sanitizer:DomSanitizer,
              private rateService:RatingService,
              private hackathonService:HackathonService) {
  }
  loadAllCourseRatings(courses: Course[]): void {
    courses.forEach(course => {
      this.rateService.getByCourse(course._id).subscribe({
        next: (ratings: Rating[]) => {
          if (ratings.length > 0) {
            const sum = ratings.reduce((acc, rating) => acc + Number(rating.rate), 0);
            course.rating = sum / ratings.length;
          } else {
            course.rating = 0;
          }
        },
        error: (error) => {
          console.error(error);
          course.rating = 0;
        }
      });
    });
  }

  ngOnInit(){
    window.scrollTo({ top: 0, behavior: 'instant' });
    this.loadData()
    this.loadHackathons();
  }
  loadData(): void {
    this.coursService.getAll().subscribe({
      next: (response: Course[]) => {
        this.loadAllCourseRatings(response)
        this.courses = response
          .sort(() => 0.5 - Math.random())
          .slice(0, 6);
      },
      error: (err) => console.error(err),
    });
  }
  hackathons:Hackathon[]=[]
  loadHackathons(): void {
    this.hackathonService.getNextHackathons().subscribe({
      next: (response) => {
        this.hackathons = response;
      }
    });
  }
  getImage(url: string | null): SafeUrl | string {
    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : '/assets/img.png';
  }
}
