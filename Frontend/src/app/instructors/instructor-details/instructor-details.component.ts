import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {InstructorService} from '../../services/instructor.service';
import {Instructor} from '../../models/Instructor';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {CourseService} from '../../services/course.service';
import {Course} from '../../models/Course';
import {Rating} from '../../models/Rating';
import {RatingService} from '../../services/rating.service';
import {AuthService} from '../../services/authServices/auth.service';

@Component({
  selector: 'app-instructor-details',
  standalone: false,
  templateUrl: './instructor-details.component.html',
  styleUrl: './instructor-details.component.css'
})
export class InstructorDetailsComponent {
  courses:Course[]=[]
  showRatingModal: boolean = false;

  openRatingModal() {
    this.showRatingModal = !this.showRatingModal;
    this.rate = 0;
    this.title = '';
    this.comment = '';
    this.error = '';
  }
  instructor:Instructor ={
    _id:"",
    firstname: "",
    adresse:"",
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
    experience:0,
    rating:0
  };
  instructorId:string |null =""
  ratings:Rating[]=[]
  currentPage: number = 1;
  itemsPerPage: number = 3;
  hasMoreReviews: boolean = true;
  constructor(
    private router:Router,
    private location: Location,
    private instructorService:InstructorService,
    private courseService:CourseService,
    private route:ActivatedRoute,
    private rateService:RatingService,
    private authService:AuthService,
    private sanitizer:DomSanitizer
  ) {
  }
  ngOnInit(){
    window.scrollTo({ top: 0, behavior: 'instant' });
    this.loadData();
  }
  loadRatings() {
    this.rateService.getByformateur(this.instructorId).subscribe({
      next: (response) => {
        this.ratings = response;
        this.updateHasMoreReviews();
      },
      error: (error) => { console.error(error) }
    });
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

  loadData(){
    this.instructorId = this.route.snapshot.paramMap.get('id') ;
    this.instructorService.getInstructorById(this.instructorId).subscribe(
      {
        next:(response)=>{
          this.instructor=response
          this.loadRatings()
            // console.log(this.instructor)
        },error:(err)=>{console.error(err)}
      }
    )
    this.courseService.getByInstructorId(this.instructorId).subscribe(
      {
        next:(response)=>{
          this.loadAllCourseRatings(response)
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
      formateurid: this.instructorId,
      userid: this.authService.getUserId() || '',
      rate: this.rate,
      title: this.title,
      comment: this.comment
    };

    this.rateService.addFormateur(ratingData).subscribe({
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
