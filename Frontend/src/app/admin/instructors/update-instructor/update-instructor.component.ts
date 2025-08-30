import { Component } from '@angular/core';
import {Category} from '../../../models/Category';
import {InstructorService} from '../../../services/instructor.service';
import {CategoryService} from '../../../services/category.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {NgForm} from '@angular/forms';
import {Instructor} from '../../../models/Instructor';

@Component({
  selector: 'app-update-instructor',
  standalone: false,
  templateUrl: './update-instructor.component.html',
  styleUrl: './update-instructor.component.css'
})
export class UpdateInstructorComponent {
  // Champs
  firstname: string = '';
  lastname: string = '';
  email: string = '';
  Site_web: string = '';
  GitHub: string = '';
  Twitter: string = '';
  LinkedIn: string = '';
  phone: string = '';
  biographie: string = '';
  speciality: string = '';
  categoryId: any = '';
  skill: string = '';
  Competences: string[] = [];
  error: string | null = null;
  fileName: string = '';
  fileSize: string = '';
  categories: Category[] = [];
  instructorId!: string;

  // File/Image
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  errorMessage = '';
  isLoading = false;

  // Autres champs
  categoryName: any;
  experience: any = 0;
  adresse: string = '';

  constructor(
    private instructorService: InstructorService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit() {
    // Récupérer l'id depuis l'URL
    this.instructorId = this.route.snapshot.paramMap.get('id')!;

    // Charger les catégories
    this.categoryService.getAll().subscribe({
      next: (response) => {
        this.categories = response
        this.instructorService.getInstructorById(this.instructorId).subscribe({
          next: (instructor: Instructor) => {
            this.firstname = instructor.firstname;
            this.lastname = instructor.lastname;
            this.email = instructor.email;
            this.Site_web = instructor.Site_web || '';
            this.GitHub = instructor.GitHub || '';
            this.Twitter = instructor.Twitter || '';
            this.LinkedIn = instructor.LinkedIn || '';
            this.phone = instructor.phone ? instructor.phone.toString() : '';
            this.biographie = instructor.biographie || '';
            this.speciality = instructor.speciality || '';
            this.categoryId = instructor.categorie ;
            console.log(instructor.categorie)
            this.Competences = instructor.Competences || [];
            this.experience = instructor.experience || 0;
            this.adresse = instructor.adresse || '';
            if (instructor.picture?.path) {
              this.imagePreview = instructor.picture.path;
            }
          },
          error: (err) => {
            console.error(err);
            this.error = "Impossible de charger les données du formateur.";
          }
        });

      },
      error: (e) => console.error(e)
    });

    // Charger les données de l'instructeur
  }

  addSkill() {
    if (this.skill && this.skill !== '') {
      this.Competences.push(this.skill);
      this.skill = '';
    }
  }
  removeSkill(skill: string) {
    this.Competences = this.Competences.filter((s) => s != skill);
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      if (!file.type.match(/image\/(jpeg|png|jpg)/)) {
        this.errorMessage = 'Seulement les images JPG/PNG sont autorisées';
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'L’image doit être inférieure à 5MB';
        return;
      }

      this.selectedFile = file;
      this.fileName = file.name;
      this.fileSize = this.formatFileSize(file.size);
      this.errorMessage = '';

      const reader = new FileReader();
      reader.onload = () => (this.imagePreview = reader.result);
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

  onSubmit(form: NgForm) {
    if (form.invalid) {
      this.error = 'Veuillez remplir tous les champs obligatoires correctement';
      return;
    }

    const formData = new FormData();
    formData.append('phone', this.phone);
    formData.append('firstname', this.firstname);
    formData.append('lastname', this.lastname);
    formData.append('email', this.email);
    formData.append('Site_web', this.Site_web);
    formData.append('GitHub', this.GitHub);
    formData.append('Twitter', this.Twitter);
    formData.append('LinkedIn', this.LinkedIn);
    formData.append('speciality', this.speciality);
    formData.append('biographie', this.biographie);
    formData.append('categoryId', this.categoryId);
    formData.append('experience', this.experience);
    formData.append('adresse', this.adresse);
    this.Competences.forEach((competence, index) => {
      formData.append(`Competences[${index}]`, competence);
    });
    if (this.selectedFile) {
      formData.append('picture', this.selectedFile);
    }

    this.isLoading = true;
    this.error = null;

    this.instructorService.updateInstructor(this.instructorId, formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        alert('Le formateur a été mis à jour avec succès !');
        this.router.navigate(['/admin/instructors']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
        this.error = err.error?.error || 'Une erreur est survenue. Veuillez réessayer plus tard.';
      }
    });
  }

  removeFile(): void {
    this.imagePreview = null;
    this.selectedFile = null;
    this.fileName = '';
    this.fileSize = '';
    this.errorMessage = '';
  }

  goBackOrFallback() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/admin/instructors']);
    }
  }
}
