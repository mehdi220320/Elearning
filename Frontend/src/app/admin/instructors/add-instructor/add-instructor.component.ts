import { Component } from '@angular/core';
import {NgForm} from '@angular/forms';
import {InstructorService} from '../../../services/instructor.service';
import {Router} from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-instructor',
  standalone: false,
  templateUrl: './add-instructor.component.html',
  styleUrl: './add-instructor.component.css'
})
export class AddInstructorComponent {
  firstname: string= '';
  lastname:string= '';
  email:string= '';
  Site_web:string= '';
  GitHub:string= '';
  Twitter:string= '';
  LinkedIn:string= '';
  picture:string= '';
  phone: string= '';
  biographie:string= '';
  speciality:string= '';
  skill:string= '';
  Competences:string[]=[]
  error: string | null = null;
  fileName: string = '';
  fileSize: string = '';

  constructor(private instructorService:InstructorService,private router:Router,private location: Location) {
  }

  addSkill(){
    if (this.skill && this.skill!=="")
    {
      this.Competences.push(this.skill)
      this.skill=""
    }
  }
  removeSkill(skill:string){
    this.Competences=this.Competences.filter(s=> s!=skill)
  }
  private formatTunisianPhone(phone: string): string {
    const digits = phone.replace(/\D/g, '');

    if (digits.startsWith('216')) {
      return '0' + digits.substring(3);
    } else if (digits.startsWith('00216')) {
      return '0' + digits.substring(4);
    }
    return digits;
  }
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  isLoading = false;
  errorMessage = '';

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
  onSubmit(form: NgForm) {
    if (form.invalid) {
      this.error = "Veuillez remplir tous les champs obligatoires correctement";
      return;
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(this.email)) {
      this.error = "Veuillez entrer une adresse email valide";
      return;
    }

    // Validate phone if provided
    if (this.phone && this.phone !== '') {
      const phoneRegex = /^(\+216|00216|0)?[2459][0-9]{7}$/;
      if (!phoneRegex.test(this.phone)) {
        this.error = "Veuillez entrer un numéro de téléphone Tunisien valide";
        return;
      }
    }

    // Validate URLs if provided
    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (this.Site_web && !urlRegex.test(this.Site_web)) {
      this.error = "Veuillez entrer une URL de site web valide";
      return;
    }
    if (this.GitHub && !urlRegex.test(this.GitHub)) {
      this.error = "Veuillez entrer une URL GitHub valide";
      return;
    }
    if (this.Twitter && !urlRegex.test(this.Twitter)) {
      this.error = "Veuillez entrer une URL Twitter valide";
      return;
    }
    if (this.LinkedIn && !urlRegex.test(this.LinkedIn)) {
      this.error = "Veuillez entrer une URL LinkedIn valide";
      return;
    }

    // Validate image
    if (!this.selectedFile) {
      this.error = "Veuillez sélectionner une image de profil";
      return;
    }

    this.phone = this.formatTunisianPhone(this.phone);
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
// Append each competence separately with the same key
    this.Competences.forEach((competence, index) => {
      formData.append(`Competences[${index}]`, competence);
    });
    if (this.selectedFile) {
      formData.append('picture', this.selectedFile);
    }

    this.isLoading = true;
    this.error = null;

    this.instructorService.addInstructor(formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        alert("Le formateur a été ajouté avec succès !");
        this.router.navigate(['/admin/instructors']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
        if (err.error && err.error.error) {
          this.error = err.error.error;
        } else if (err.status === 409) {
          this.error = "Un formateur avec cet email existe déjà.";
        } else if (err.status === 400) {
          this.error = "Données invalides. Veuillez vérifier les informations saisies.";
        } else if (err.status === 413) {
          this.error = "L'image est trop volumineuse. Veuillez en choisir une plus petite.";
        } else if (err.status === 0) {
          this.error = "Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet.";
        } else {
          this.error = "Une erreur s'est produite. Veuillez réessayer plus tard.";
        }
      }
    });
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
  goBackOrFallback() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/admin/instructors']);
    }
  }
}
