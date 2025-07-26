import { Component } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../services/authServices/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-forgetpassword',
  standalone: false,
  templateUrl: './forgetpassword.component.html',
  styleUrl: './forgetpassword.component.css'
})
export class ForgetpasswordComponent {
  resetForm: FormGroup;
  showForm = true;
  showCodeForm = false;
  showSuccess = false;
  emailSent = false;
  isLoading = false;
  errorMessage = '';
  passwordVisible = false;
  confirmPasswordVisible = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      code: ['', Validators.required],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  get email() { return this.resetForm.get('email'); }
  get code() { return this.resetForm.get('code'); }
  get newPassword() { return this.resetForm.get('newPassword'); }
  get confirmPassword() { return this.resetForm.get('confirmPassword'); }

  onSubmitEmail() {
    if (this.email?.invalid) {
      this.errorMessage = 'Veuillez entrer une adresse email valide';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.forgotPassword(this.resetForm.value.email).subscribe({
      next: () => {
        this.emailSent = true;
        this.showForm = false;
        this.showCodeForm = true;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Erreur lors de l\'envoi du code de réinitialisation';
        this.isLoading = false;
      }
    });
  }

  onSubmitReset() {
    if (this.resetForm.invalid) {
      if (this.code?.invalid) {
        this.errorMessage = 'Le code de réinitialisation est requis';
      } else if (this.newPassword?.invalid) {
        this.errorMessage = 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial';
      } else if (this.confirmPassword?.invalid) {
        this.errorMessage = 'Veuillez confirmer votre mot de passe';
      } else if (this.resetForm.errors?.['mismatch']) {
        this.errorMessage = 'Les mots de passe ne correspondent pas';
      }
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { email, code, newPassword } = this.resetForm.value;
    this.authService.resetPassword(email, code, newPassword).subscribe({
      next: () => {
        this.showSuccess = true;
        this.showCodeForm = false;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Erreur lors de la réinitialisation du mot de passe';
        this.isLoading = false;
      }
    });
  }

  backToLogin() {
    this.router.navigate(['/login']);
  }

  togglePasswordVisibility(field: string) {
    if (field === 'password') {
      this.passwordVisible = !this.passwordVisible;
    } else {
      this.confirmPasswordVisible = !this.confirmPasswordVisible;
    }
  }
  getPasswordStrengthClass(): string {
    if (!this.newPassword?.value) return '';

    const password = this.newPassword.value;
    const length = password.length;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (length < 4) return 'weak';
    if (length < 8) return 'medium';
    if (!this.newPassword.errors?.['pattern'] && !hasSpecialChar) return 'strong';
    if (!this.newPassword.errors?.['pattern'] && hasSpecialChar) return 'very-strong';
    return '';
  }

  getPasswordStrengthText(): string {
    if (!this.newPassword?.value) return '';

    const password = this.newPassword.value;
    const length = password.length;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (length < 4) return 'Faible';
    if (length < 8) return 'Moyen';
    if (!this.newPassword.errors?.['pattern'] && !hasSpecialChar) return 'Fort';
    if (!this.newPassword.errors?.['pattern'] && hasSpecialChar) return 'Très fort';
    return '';
  }
}
