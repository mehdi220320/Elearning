import {Component, OnInit} from '@angular/core';
import {InstructorService} from '../../../services/instructor.service';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {CategoryService} from '../../../services/category.service';
import {Instructor} from '../../../models/Instructor';
import {Category} from '../../../models/Category';
import {NgForm} from '@angular/forms';
import {CourseService} from '../../../services/course.service';

@Component({
  selector: 'app-add-cour',
  standalone: false,
  templateUrl: './add-cour.component.html',
  styleUrl: './add-cour.component.css'
})
export class AddCourComponent implements OnInit{
  categories:Category[]=[]
  instructors:Instructor[]=[]
  learns:string []=[]
  selectedCategory: string | null = null;
  categoryName: string="";
  title:string="";
  prix:string="";
  description_detaillee:string="";
  niveau:string="";
  duree:string="";
  langue:string="";
  certificat:string="";
  description:string="";

  constructor(private instructorService:InstructorService,
              private categoryService:CategoryService,
              private router:Router,
              private location: Location,
              private courseService:CourseService) {}
  ngOnInit(): void {
    this.loadData();
  }
  loadData(){
    this.categoryService.getAll().subscribe({
      next:(response)=>{
        this.categories=response;
      },error:(e)=>{console.error(e)}
    });
    this.instructorService.getAll().subscribe({
      next:(response)=>{
        this.instructors=response;
      },error:(e)=>console.error(e)
    });
  }

  goBackOrFallback() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/admin/instructors']);
    }
  }
  addCategory(){
    if(this.categoryName===""){
      return alert("Merci de renseigner un titre pour la catégorie");
    }
    this.categoryService.addCategory(this.categoryName).subscribe(
      {
        next:(response)=>{
          this.loadData()
          alert("La catégorie " + this.categoryName + " a été ajoutée avec succès");
        },error:(error)=>{
          console.error(error)
          alert("Une erreur s'est produite avec le produit. Veuillez réessayer ultérieurement.");
        }
      }
    )
  }

  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  isLoading = false;
  errorMessage = '';
  fileName: string = '';
  fileSize: string = '';
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
  error: string | null = null;
  categoryId: string="";
  formateurId: string="";
  learn:string=""
  addLearn(){
    if (this.learn && this.learn!=="")
    {
      this.learns.push(this.learn)
      this.learn=""
    }
  }
  onSubmit(form: NgForm) {
    if (form.invalid) {
      this.error = "Veuillez remplir tous les champs obligatoires correctement";
      return;
    }
    const formData = new FormData();

    formData.append('title', this.title);
    formData.append('description_detaillee', this.description_detaillee);
    formData.append('prix', this.prix);
    formData.append('niveau', this.niveau);
    formData.append('duree', this.duree);
    formData.append('langue', this.langue);
    formData.append('certificat', this.certificat);
    formData.append('description', this.description);
    formData.append('categoryId', this.categoryId);
    formData.append('formateurId', this.formateurId);
    this.learns.forEach((learn, index) => {
      formData.append(`learns[${index}]`, learn);
    });
    if (this.selectedFile) {
      formData.append('coverImage', this.selectedFile);
    }
    this.isLoading = true;
    this.error = null;

    this.courseService.add(formData).subscribe({
      next:(response)=>{
        this.isLoading = true;
        this.router.navigate(['/admin/courses']);
        alert("Le cours a été ajouté avec succès !");
      },error:(err)=>{console.error(err)}
    })
  }

  removeLearn(learn: any) {
    this.learns=this.learns.filter(l=> l!=learn)
  }
}
