import {Component, OnInit} from '@angular/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {AuthService} from '../services/authServices/auth.service';
import {Router} from '@angular/router';
import {UsersService} from '../services/users.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Location} from '@angular/common';

@Component({
  selector: 'app-edit-user',
  standalone: false,
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css'
})
export class EditUserComponent implements OnInit {
  editForm!: FormGroup; // Ajout du ! pour indiquer l'initialisation différée
  user: any = null;
  loading = false;
  successMessage = '';
  errorMessage = '';
  previewImage: SafeUrl | string = '/assets/img.png';

  constructor(
    private authService: AuthService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private userService: UsersService,
    private location: Location,

    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadUserData();
  }

  private initForm() {
    this.editForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern('^[0-9]{8,15}$')]],
      role: ['user', Validators.required],
      isActive: [true]
    });
  }

  private loadUserData() {
    const userEmail = this.authService.getUserEmail();
    if (!userEmail) {
      this.errorMessage = 'Email utilisateur non trouvé';
      return;
    }

    this.userService.getUserByEmail(userEmail).subscribe({
      next: (user) => {
        this.user = user;
        this.previewImage = this.getImageUser(user.picture);
        this.editForm.patchValue({
          firstname: user.firstname || '',
          lastname: user.lastname || '',
          email: user.email || '',
          phone: user.phone || '',
          role: user.role || 'user',
          isActive: user.isActive !== undefined ? user.isActive : true
        });
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des données utilisateur';
        console.error('Error loading user:', error);
      }
    });
  }

  getImageUser(picture: string): SafeUrl | string {
    return picture && picture !== "" ?
      this.sanitizer.bypassSecurityTrustResourceUrl(picture) :
      '/assets/img.png';
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImage = e.target.result;
        // Vous pouvez ajouter ici la logique pour uploader l'image
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.editForm.valid && this.user) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      this.userService.updateUser(this.user._id, this.editForm.value).subscribe({
        next: (updatedUser) => {
          this.loading = false;
          this.successMessage = 'Profil mis à jour avec succès!';
          this.user = updatedUser;
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = 'Erreur lors de la mise à jour: ' + (error.error?.message || error.message || 'Erreur inconnue');
          console.error('Update error:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.editForm.controls).forEach(key => {
      const control = this.editForm.get(key);
      control?.markAsTouched();
    });
  }

  get f() {
    return this.editForm.controls;
  }

  // Méthode pour vérifier si un champ est invalide
  isFieldInvalid(fieldName: string): boolean {
    const field = this.editForm.get(fieldName);
    return !!field && field.invalid && field.touched;
  }

  // Méthode pour obtenir le message d'erreur d'un champ
  getFieldError(fieldName: string): string {
    const field = this.editForm.get(fieldName);
    if (!field || !field.errors || !field.touched) return '';

    const errors = field.errors;
    if (errors['required']) return 'Ce champ est requis';
    if (errors['email']) return 'Format d\'email invalide';
    if (errors['minlength']) return `Minimum ${errors['minlength'].requiredLength} caractères`;
    if (errors['pattern']) return 'Format invalide';

    return 'Erreur de validation';
  }
  goBackOrFallback() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/admin/instructors']);
    }
  }
}
