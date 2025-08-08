import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../services/authServices/auth.service';
import { jwtDecode } from 'jwt-decode';
import {environment} from '../models/environment';
declare var google:any;

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  errorMessage: string | null = null;
  showExpiredMessage = false;
  ExpiredMessage="your token is expired login again";
  constructor(
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,

  ) {}

  onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password';
      return;
    }

    this.errorMessage = null;

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.handleLoginResponse(response);
      },
      error: (error) => {
        this.handleLoginError(error);
      }
    });
  }

  private handleLoginResponse(response: any) {

    if (response.token) {
      if (this.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }

      try {
        const decoded: any = jwtDecode(response.token);
        const userId = decoded.userId;
        const role = decoded.role;

        this.authService.setToken(response.token);
        // this.authService.setUserRole(role);

        if (role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/home']);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        this.errorMessage = 'Login error. Please try again.';
      }
    }
  }

  private handleLoginError(error: any) {
    console.error('Login error:', error);

    if (error.status === 401) {
      this.errorMessage = 'Invalid email or password';
    } else if (error.status === 0) {
      this.errorMessage = 'Cannot connect to server. Please check your connection.';
    } else {
      this.errorMessage = 'Login failed. Please try again later.';
    }
  }
  ngOnInit() {
    google.accounts.id.initialize({
      client_id: environment.client_id,
      callback: (response: any) => this.handleGoogleSignIn(response)
    });

    google.accounts.id.renderButton(document.getElementById("google-btn"), {
      type: 'icon',
      shape: 'circle',
      size: 'large',
      width: '100px'
    });

    google.accounts.id.prompt();
    this.route.queryParams.subscribe(params => {
      this.showExpiredMessage = params['expired'] === 'true';
    });
  }

  private handleGoogleSignIn(response: any) {
    this.errorMessage = null;

    this.authService.loginWithGoogle(response.credential).subscribe({
      next: (authResponse) => {
        this.handleLoginResponse(authResponse);
      },
      error: (error) => {
        this.handleLoginError(error);
      }
    });
  }
}
