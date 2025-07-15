import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  firstname: string = "";
  lastname: string = "";
  email: string = "";
  phone: string = "";
  password: string = "";
  confPassword: string = "";
  terms: boolean = false;
  newsletter: boolean = false;
  error: string | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit(form: NgForm) {
    if (form.invalid) {
      this.error = "Veuillez remplir tous les champs correctement";
      return;
    }

    if (this.password !== this.confPassword) {
      this.error = "Les mots de passe ne correspondent pas!";
      return;
    }

    // Format phone number to standard Tunisian format (remove prefixes)
    const formattedPhone = this.formatTunisianPhone(this.phone);

    this.auth.register(
      this.lastname,
      this.firstname,
      this.email,
      this.password,
      formattedPhone
    ).subscribe({
      next: (response) => {
        alert("Registration successful!");
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.error = error.error?.message || error.message || "Une erreur s'est produite lors de l'inscription";
        console.error('Registration error:', error);
      }
    });
  }

  private formatTunisianPhone(phone: string): string {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');

    // If starts with country code (216 or 00216), convert to 0 format
    if (digits.startsWith('216')) {
      return '0' + digits.substring(3);
    } else if (digits.startsWith('00216')) {
      return '0' + digits.substring(4);
    }

    // Otherwise return as is (assuming it's already in 0X format)
    return digits;
  }

  checkPasswordStrength() {
    const password = this.password;
    const strengthBar = document.getElementById('password-strength-bar');

    if (!password) {
      strengthBar?.classList.remove('weak', 'fair', 'good', 'strong');
      strengthBar!.style.width = '0%';
      return;
    }

    // Reset classes
    strengthBar?.classList.remove('weak', 'fair', 'good', 'strong');

    // Calculate strength
    let strength = 0;

    // Length check
    if (password.length >= 8) strength += 1;

    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 1;

    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 1;

    // Contains number
    if (/\d/.test(password)) strength += 1;

    // Contains special char
    if (/[@$!%*?&]/.test(password)) strength += 1;

    // Apply visual feedback
    switch(strength) {
      case 0:
      case 1:
        strengthBar?.classList.add('weak');
        strengthBar!.style.width = '25%';
        break;
      case 2:
        strengthBar?.classList.add('fair');
        strengthBar!.style.width = '50%';
        break;
      case 3:
      case 4:
        strengthBar?.classList.add('good');
        strengthBar!.style.width = '75%';
        break;
      case 5:
        strengthBar?.classList.add('strong');
        strengthBar!.style.width = '100%';
        break;
    }
  }
}
