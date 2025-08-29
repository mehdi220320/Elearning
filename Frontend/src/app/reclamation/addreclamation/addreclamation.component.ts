import { Component } from '@angular/core';
import {NgForm} from '@angular/forms';
import {CourseService} from '../../services/course.service';
import {HackathonService} from '../../services/hackathon.service';
import {Course} from '../../models/Course';
import {Hackathon} from '../../models/Hackathon';
import {AuthService} from '../../services/authServices/auth.service';
import {ReclamationService} from '../../services/reclamation.service';

@Component({
  selector: 'app-addreclamation',
  standalone: false,
  templateUrl: './addreclamation.component.html',
  styleUrl: './addreclamation.component.css'
})
export class AddreclamationComponent {
  constructor(private courseService:CourseService,
              private hackathonService:HackathonService,
              private authService:AuthService,
              private reclamationService:ReclamationService) {
  }
  courses:Course[]=[]
  hackathons:Hackathon[]=[]
  course=""
  hackathon=""
  depends=""
  sujet=""
  type=""
  description=""
  error=""
  userId:any=""
  isLoading:boolean=false;
  loadCourses(){
    this.courseService.getAll().subscribe({
      next: (response: Course[]) => {
        this.courses = response;
      },
      error: (err) => console.error(err),
    });

  }
  loadHackathons(){
    this.hackathonService.getAll().subscribe({
      next: (response: Hackathon[]) => {
        this.hackathons = response;
      },
      error: (err) => console.error(err),
    });
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      this.error = "Veuillez remplir tous les champs obligatoires correctement";
      return;
    }

    if (this.authService.getUserId()) {
      this.userId = this.authService.getUserId();
    }

    const data = {
      sujet: this.sujet,
      description: this.description,
      type: this.type,
      hackathonId: this.hackathon,
      courseId: this.course,
      userId: this.userId,
    };

    this.isLoading = true;
    this.reclamationService.add(data).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.type = "";
        this.sujet = "";
        this.course = "";
        this.hackathon = "";
        this.depends = "";
        this.description = "";
        alert("La réclamation a été envoyée avec succès !");
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }
  toggleRadio(value: string) {
    if (this.depends === value) {
      this.depends = "";
      this.course="";
      this.hackathon="";
    } else {
      this.depends = value;
      if (value === 'hackathon') {
        this.loadCourses();
      } else if (value === 'course') {
        this.loadHackathons();
      } else if (value === 'both') {
        this.loadHackathons();
        this.loadCourses();
      }
    }
  }
}
