import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {InstructorService} from '../../services/instructor.service';
import {Instructor} from '../../models/Instructor';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {CourseService} from '../../services/course.service';
import {Course} from '../../models/Course';

@Component({
  selector: 'app-instructor-details',
  standalone: false,
  templateUrl: './instructor-details.component.html',
  styleUrl: './instructor-details.component.css'
})
export class InstructorDetailsComponent {
  courses:Course[]=[]
  instructor:Instructor ={
    _id:"",
    firstname: "",
    lastname:"",
    email:"",
    Site_web:"",
    GitHub:"",
    Twitter:"",
    LinkedIn:"",
    picture:{
      path: "/assets/img.png",
      contentType: "",
    },
    phone: "",
    biographie:"",
    speciality:"",
    Competences:[""],
    categorie: {
      _id: "",
      name: "",
    },
    createdAt:"",
    experience:0
  };
  instructorId:string |null =""
  constructor(
    private router:Router,
    private location: Location,
    private instructorService:InstructorService,
    private courseService:CourseService,
    private route:ActivatedRoute,
    private sanitizer:DomSanitizer
  ) {
  }
  ngOnInit(){
    this.loadData();
  }

  loadData(){
    this.instructorId = this.route.snapshot.paramMap.get('id') ;
    this.instructorService.getInstructorById(this.instructorId).subscribe(
      {
        next:(response)=>{
          this.instructor=response
            // console.log(this.instructor)
        },error:(err)=>{console.error(err)}
      }
    )
    this.courseService.getByInstructorId(this.instructorId).subscribe(
      {
        next:(response)=>{
          this.courses=response,
            console.log(this.courses)
        },error:(err)=>{console.error(err)}
      }
    )
  }
  getImage(url: string | null): SafeUrl | string {
    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : '/assets/img.png';
  }
  goBackOrFallback() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/instructors']);
    }
  }
}
