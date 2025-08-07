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
  sampleReviews = [
    {
      id: 1,
      name: "Mohamed Ali",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5,
      date: "15 Mars 2023",
      comment: "Excellent formateur! Les explications sont très claires et les supports de cours sont bien organisés. Je recommande vivement.",
      likes: 12
    },
    {
      id: 2,
      name: "Sarah Ben Ahmed",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 4,
      date: "2 Février 2023",
      comment: "Très bon pédagogue. J'ai beaucoup appris même si parfois le rythme était un peu rapide pour moi.",
      likes: 5
    },
    {
      id: 3,
      name: "Karim Jlassi",
      avatar: "https://randomuser.me/api/portraits/men/75.jpg",
      rating: 5,
      date: "28 Janvier 2023",
      comment: "Un des meilleurs formateurs que j'ai eu. Il prend le temps de répondre à toutes les questions et ses exemples sont très pertinents.",
      likes: 8
    }
  ];

  getRatingPercentage(rating: number): number {
    // Temporary static data - replace with real calculations later
    const ratingDistribution = {
      5: 65,
      4: 20,
      3: 10,
      2: 3,
      1: 2
    };
    return ratingDistribution[rating as keyof typeof ratingDistribution];
  }

  openRatingModal() {
    // Implement modal opening logic here
    console.log("Open rating modal");
  }
}
