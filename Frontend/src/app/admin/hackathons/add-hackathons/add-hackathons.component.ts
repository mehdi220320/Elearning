import {Component, OnInit} from '@angular/core';
import {CourseService} from '../../../services/course.service';
import {Course} from '../../../models/Course';
import {Category} from '../../../models/Category';
import {CategoryService} from '../../../services/category.service';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {HackathonService} from '../../../services/hackathon.service';

@Component({
  selector: 'app-add-hackathons',
  standalone: false,
  templateUrl: './add-hackathons.component.html',
  styleUrl: './add-hackathons.component.css'
})
export class AddHackathonsComponent implements OnInit{
  courses:Course[]=[]
  categories:Category[]=[]
  categoryid="";
  fee="";
  title="";
  Prizes="";
  description="";
  shortDescription="";
  coursesSelected: string[] = [];
  startDate!: any;
  endDate!: any;
  location="";
  maxParticipants="";

  constructor(private courseService:CourseService,
              private categoryService:CategoryService,
              private hackathonService:HackathonService,
              private router:Router,
              private loc: Location) {}

  ngOnInit(): void {
    this.loadCategories()
  }
  loadCategories(){
    this.categoryService.getAll().subscribe({
      next:(response)=>{
        this.categories=response;
      },error:(err)=>{
        console.error(err)
      }
    })
  }
  loadCourses(){
    this.courseService.getCoursesByCategorie(this.categoryid).subscribe({
      next:(response)=> {
        this.courses = response;
        console.log(this.courses)
      },
      error:(err)=> console.error(err)
    })
  }

  isSelected(courseId: string): boolean {
    return this.coursesSelected.includes(courseId);
  }

  toggleCourseSelection(courseId: string, isChecked: boolean): void {
    if (isChecked) {
      if (!this.coursesSelected.includes(courseId)) {
        this.coursesSelected.push(courseId);
      }
    } else {
      const index = this.coursesSelected.indexOf(courseId);
      if (index > -1) {
        this.coursesSelected.splice(index, 1);
      }
    }
  }
  goBackOrFallback() {
    if (window.history.length > 1) {
      this.loc.back();
    } else {
      this.router.navigate(['/admin/instructors']);
    }
  }
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  isLoading = false;
  errorMessage = '';
  fileName: string = '';
  fileSize: string = '';
  error: string | null = null;
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      if (!file.type.match(/image\/(jpeg|png|jpg)/)) {
        this.errorMessage = 'Only JPG/PNG images are allowed';
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'Image must be less than 5MB';
        return;
      }

      this.selectedFile = file;
      this.fileName = file.name;
      this.fileSize = this.formatFileSize(file.size);
      this.errorMessage = '';

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  removeFile(): void {
    this.imagePreview = null;
    this.selectedFile = null;
    this.fileName = '';
    this.fileSize = '';
    this.errorMessage = '';
    const fileInput = document.getElementById('thumbnail') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
  onSubmit(form: NgForm) {
    if (form.invalid) {
      this.error = "Veuillez remplir tous les champs obligatoires correctement";
      return;
    }
    const formData = new FormData();
    formData.append('maxParticipants', this.maxParticipants);
    formData.append('title', this.title);
    formData.append('location', this.location);
    formData.append('startDate', this.startDate);
    formData.append('endDate', this.endDate);
    formData.append('shortDescription', this.shortDescription);
    formData.append('description', this.description);
    formData.append('theme', this.categoryid);
    formData.append('fee', this.fee);
    formData.append('Prizes', this.Prizes);
    this.coursesSelected.forEach((course, index) => {
      formData.append(`courses[${index}]`, course);
    });
    this.objectifs.forEach((objectif, index) => {
      formData.append(`objectifs[${index}]`, objectif);
    });
    this.competences.forEach((skill, index) => {
      formData.append(`skills[${index}]`, skill);
    });
    this.rules.forEach((rule, index) => {
      formData.append(`rules[${index}]`, rule);
    });
    if (this.selectedFile) {
      formData.append('coverImageFile', this.selectedFile);
    }
    this.hackathonService.add(formData).subscribe({
      next:(response)=>{
        this.isLoading = true;
        this.router.navigate(['/admin/hackathons']);
        alert("Le hackathon a été ajouté avec succès !");
      },error:(err)=>{console.error(err)}
    })
  }
  objectifs:string[]=[]
  objectif:string=""
  addobjectif(){
    if (this.objectif && this.objectif!=="")
    {
      this.objectifs.push(this.objectif)
      this.objectif=""
    }
  }
  removeobjectif(learn: any) {
    this.objectifs=this.objectifs.filter(l=> l!=learn)
  }

  skill:string= '';
  competences:string[]=[]
  addSkill(){
    if (this.skill && this.skill!=="")
    {
      this.competences.push(this.skill)
      this.skill=""
    }
  }
  removeSkill(skill:string){
    this.competences=this.competences.filter(s=> s!=skill)
  }

  rules:string[]=[]
  rule:string=""
  addrule(){
    if (this.rule && this.rule!=="")
    {
      this.rules.push(this.rule)
      this.rule=""
    }
  }
  removerule(learn: any) {
    this.rules=this.rules.filter(l=> l!=learn)
  }
}
