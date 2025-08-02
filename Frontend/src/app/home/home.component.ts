import { Component } from '@angular/core';
import {CourseService} from '../services/course.service';
import {Course} from '../models/Course';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  courses:Course[]=[]
  constructor(private coursService:CourseService,private sanitizer:DomSanitizer) {
  }
  ngOnInit(){
    this.loadData()
  }
  loadData(): void {
    this.coursService.getAll().subscribe({
      next: (response: Course[]) => {
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
