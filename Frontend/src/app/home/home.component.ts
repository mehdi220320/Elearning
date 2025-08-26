import { Component } from '@angular/core';
import {CourseService} from '../services/course.service';
import {Course} from '../models/Course';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {RatingService} from '../services/rating.service';
import {Rating} from '../models/Rating';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  courses:Course[]=[]
  constructor(private coursService:CourseService,private sanitizer:DomSanitizer,private rateService:RatingService) {
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
          // Update the filtered courses after ratings are loaded
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
  }
  loadData(): void {
    this.coursService.getAll().subscribe({
      next: (response: Course[]) => {
        this.loadAllCourseRatings(response)
        this.courses = response
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
      },
      error: (err) => console.error(err),
    });
  }
  getImage(url: string | null): SafeUrl | string {
    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : '/assets/img.png';
  }
}
