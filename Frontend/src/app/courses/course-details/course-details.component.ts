import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {InstructorService} from '../../services/instructor.service';
import {CourseService} from '../../services/course.service';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {Course} from '../../models/Course';
import {Rating} from '../../models/Rating';
import {Instructor} from '../../models/Instructor';
import {AuthService} from '../../services/authServices/auth.service';
import {RatingService} from '../../services/rating.service';

@Component({
  selector: 'app-course-details',
  standalone: false,
  templateUrl: './course-details.component.html',
  styleUrl: './course-details.component.css'
})
export class CourseDetailsComponent {
  instructor:Instructor ={
    _id:"",
    firstname: "",
    adresse:"",
    rating:0,
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
  ratings:Rating[]=[]
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
        learns:[],

  }
  currentPage: number = 1;
  itemsPerPage: number = 3;
  hasMoreReviews: boolean = true;
  popularCourses:Course[]=[]
  constructor(private router:Router,
              private location: Location,
              private courseService:CourseService,
              private route:ActivatedRoute,
              private instructorService:InstructorService,
              private authService:AuthService,
              private rateService:RatingService,
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
          this.loadRatings();
        },error:(err)=>{console.error(err)}
      }
    )

  }
  loadRatings() {
    this.rateService.getByCourse(this.courseId).subscribe({
      next: (response) => {
        this.ratings = response;
        this.updateHasMoreReviews();
      },
      error: (error) => { console.error(error) }
    });
  }
  ngOnInit(){
    this.loadData()
    console.log(this.authService.getUserId())

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
  rate:number=0;
  comment:string="";
  title:string="";
  setRating(number: number) {
    if (this.rate!==number){
      this.rate=number
    }else{
      this.rate=0
    }
  }
  error:string=""
  submitRate() {
    if (this.comment === '' && this.title) {
      this.error = "Le titre et commentaire sont requis"
      return;
    }
    if (this.title === '') {
      this.error = "Le titre est requis"
      return;
    }
    if (this.comment === '') {
      this.error = "Le commentaire est requis"
      return;
    }

    const ratingData = {
      courseid: this.course._id,
      userid: this.authService.getUserId() || '',
      rate: this.rate,
      title: this.title,
      comment: this.comment
    };

    this.rateService.addCourse(ratingData).subscribe({
      next: (response) => {
        this.comment = "";
        this.rate = 0;
        this.title = "";
        this.error = '';
        this.loadRatings(); // Reload ratings after submission
        this.currentPage = 1; // Reset to first page
      },
      error: (err) => console.error(err)
    });
  }

  loadMoreReviews() {
    this.currentPage++;
    this.updateHasMoreReviews();
  }

  updateHasMoreReviews() {
    this.hasMoreReviews = this.ratings.length > this.currentPage * this.itemsPerPage;
  }

  get paginatedRatings(): Rating[] {
    const startIndex = 0; // Always show all ratings up to current page
    const endIndex = this.currentPage * this.itemsPerPage;
    return this.ratings.slice(0, endIndex);
  }

  calculateAverageRating(): number {
    if (this.ratings.length === 0) return 0;
    const sum = this.ratings.reduce((acc, rating) => acc + Number(rating.rate), 0);
    return sum / this.ratings.length;
  }

  getRatingDistribution(): { [key: number]: number } {
    const distribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    this.ratings.forEach(rating => {
      const rate = Math.round(Number(rating.rate));
      distribution[rate]++;
    });

    return distribution;
  }
}
