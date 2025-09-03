import { Component } from '@angular/core';
import {AuthService} from '../../../services/authServices/auth.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-create-admin',
  standalone: false,
  templateUrl: './create-admin.component.html',
  styleUrl: './create-admin.component.css'
})
export class CreateAdminComponent {
  adminForm: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.adminForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.adminForm.valid) {
      this.isLoading = true;
      this.successMessage = '';
      this.errorMessage = '';

      const { firstname, lastname, email, phone, password } = this.adminForm.value;

      this.authService.registerAdmin(lastname, firstname, email, password, phone).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = 'Administrateur créé avec succès ! Les identifiants ont été envoyés par email.';
          this.adminForm.reset();
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Erreur lors de la création de l\'administrateur';
          console.error('Error creating admin:', error);
        }
      });
    }
  }
}
