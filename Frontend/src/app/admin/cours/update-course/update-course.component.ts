import { Component } from '@angular/core';
import {Category} from '../../../models/Category';
import {Course} from '../../../models/Course';
import {Instructor} from '../../../models/Instructor';
import {InstructorService} from '../../../services/instructor.service';
import {CategoryService} from '../../../services/category.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {CourseService} from '../../../services/course.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-update-course',
  standalone: false,
  templateUrl: './update-course.component.html',
  styleUrl: './update-course.component.css'
})
export class UpdateCourseComponent {
  categories: Category[] = [];
  instructors: Instructor[] = [];
  learns: string[] = [];
  selectedCategory: string | null = null;
  categoryName: string = "";
  title: string = "";
  prix: number = 0;
  description_detaillee: string = "";
  niveau: string = "";
  duree: string = "";
  langue: string = "";
  certificat: string = "";
  description: string = "";
  courseId: string = "";
  isLoading = false;
  error: string | null = null;
  categoryId: string = "";
  formateurId: string = "";
  learn: string = "";
  currentCourse: Course | null = null;

  // File upload properties
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  fileName: string = '';
  fileSize: string = '';
  errorMessage: string = '';

  constructor(
    private instructorService: InstructorService,
    private categoryService: CategoryService,
    private router: Router,
    private location: Location,
    private courseService: CourseService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id') || '';
    this.loadData();
  }

  loadData() {
    // Load categories and instructors first
    this.categoryService.getAll().subscribe({
      next: (response) => {
        this.categories = response;
      },
      error: (e) => { console.error(e) }
    });

    this.instructorService.getAll().subscribe({
      next: (response) => {
        this.instructors = response;
        // Now load course data after instructors are loaded
        this.loadCourseData();
      },
      error: (e) => console.error(e)
    });
  }

  loadCourseData(): void {
    this.courseService.getById(this.courseId).subscribe({
      next: (course) => {
        this.currentCourse = course;
        this.title = course.title;
        this.prix = course.prix;
        this.description_detaillee = course.description_detaillee;
        this.niveau = course.niveau;
        this.duree = course.duree;
        this.langue = course.langue;
        this.certificat = course.certificat.toString();
        this.description = course.description;
        this.categoryId = course.categorie._id;

        // Set formateurId - check if formateur is populated or just an ID
        if (typeof course.formateur === 'object' && course.formateur !== null) {
          this.formateurId = course.formateur._id;
        } else {
          this.formateurId = course.formateur as string;
        }

        // Set learns
        this.learns = course.learns || [];

        // Set image preview if exists
        if (course.coverImage && course.coverImage.path) {
          this.imagePreview = course.coverImage.path;
          this.fileName = "Current image";
          this.fileSize = "Already uploaded";
        }
      },
      error: (err) => {
        console.error('Error loading course:', err);
        this.error = 'Erreur lors du chargement du cours';
      }
    });
  }

  goBackOrFallback() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/admin/courses']);
    }
  }

  addCategory() {
    if (this.categoryName === "") {
      return alert("Merci de renseigner un titre pour la catégorie");
    }
    this.categoryService.addCategory(this.categoryName).subscribe({
      next: (response) => {
        this.loadData();
        alert("La catégorie " + this.categoryName + " a été ajoutée avec succès");
      },
      error: (error) => {
        console.error(error);
        alert("Une erreur s'est produite avec le produit. Veuillez réessayer ultérieurement.");
      }
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      if (!file.type.match(/image\/(jpeg|png|jpg)/)) {
        this.errorMessage = 'Seules les images JPG/PNG sont autorisées';
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = "L'image doit être inférieure à 5MB";
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

  addLearn() {
    if (this.learn && this.learn !== "") {
      this.learns.push(this.learn);
      this.learn = "";
    }
  }

  removeLearn(learn: any) {
    this.learns = this.learns.filter(l => l !== learn);
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      this.error = "Veuillez remplir tous les champs obligatoires correctement";
      return;
    }

    const formData = new FormData();

    formData.append('title', this.title);
    formData.append('description_detaillee', this.description_detaillee);
    formData.append('prix', this.prix.toString());
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

    this.courseService.update(this.courseId, formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/admin/courses']);
        alert("Le cours a été modifié avec succès !");
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.error = "Une erreur s'est produite lors de la modification du cours";
      }
    });
  }
}
