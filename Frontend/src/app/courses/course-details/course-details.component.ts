import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {InstructorService} from '../../services/instructor.service';
import {CourseService} from '../../services/course.service';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {Course} from '../../models/Course';
import {Instructor} from '../../models/Instructor';

@Component({
  selector: 'app-course-details',
  standalone: false,
  templateUrl: './course-details.component.html',
  styleUrl: './course-details.component.css'
})
export class CourseDetailsComponent {
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
  instructor:Instructor ={
    _id:"",
    firstname: "",
    experience:0,
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
  };

  popularCourses:Course[]=[]
  constructor(private router:Router,
              private location: Location,
              private courseService:CourseService,
              private route:ActivatedRoute,
              private instructorService:InstructorService,
              private sanitizer:DomSanitizer) {}
  loadData(){
    this.courseId = this.route.snapshot.paramMap.get('id') ;
    this.courseService.getById(this.courseId).subscribe(
      {
        next:(response)=>{
          this.course=response
          this.courseService.getCoursesByCategorie(this.course.categorie._id).subscribe(
            {
              next:(response)=>{

                this.popularCourses = response
                  .filter((x: Course) => x._id !== this.course._id)
                  .sort(() => 0.5 - Math.random())
                  .slice(0, 3);


              },error:(err)=>{console.error(err)}
            }
          )
          this.instructorService.getInstructorById(this.course.formateur).subscribe(
            {
              next:(response)=>{
                this.instructor=response
                console.log(this.instructor)
              },error:(err)=>{console.error(err)}
            }
          )
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
}
