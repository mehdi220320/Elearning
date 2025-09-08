import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../models/environment';

interface DecodedToken {
  userId?: string;
  email?:string;
  role?: string;
  isActive?:boolean;
  exp?: number;
  picture?:string;
  [key: string]: any;
}

declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + 'auth';
  private tokenKey = 'auth_token';
  private authSourceKey = 'auth_source';

  constructor(private http: HttpClient) {}

  // Registration
  register(lastname: string, firstname: string, email: string, password: string, phone: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { lastname, firstname, email, password, phone });
  }
  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
  registerAdmin(lastname: string, firstname: string, email: string, password: string, phone: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/register-admin`,
      { lastname, firstname, email, password, phone },
      { headers }
    );
  }
  // Login with email/password
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        if (response.token) {
          this.setToken(response.token);
        }
      })
    );
  }

  // Google OAuth login
  loginWithGoogle(credential: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/google-auth`, { credential }).pipe(
      tap((response: any) => {
        if (response.token) {
          this.setToken(response.token);
        }
      })
    );
  }

  // Token management
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Get decoded token (with error handling)
  getDecodedToken(): DecodedToken | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode<DecodedToken>(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  // Get user role from token
  getUserRole(): string | null {
    const decoded = this.getDecodedToken();
    return decoded?.role || null;
  }
  isUserActive(): boolean {
    const decoded = this.getDecodedToken();
    return decoded?.isActive === true;
  }

  getisActive(): boolean {
    return this.isUserActive();
  }
  getUserId(): string | null {
    const decoded = this.getDecodedToken();
    return decoded?.userId || null;
  }
  getUserPicture(): string | null {
    const decoded = this.getDecodedToken();
    return decoded?.picture || null;
  }
  getUserEmail(): string | null {
    const decoded = this.getDecodedToken();
    return decoded?.email || null;
  }
  // Authentication checks
  isLoggedIn(): boolean {
    return this.isTokenValid();
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }

  isGoogleAuth(): boolean {
    return localStorage.getItem(this.authSourceKey) === 'google';
  }

  // Token validation
  isTokenValid(): boolean {
    const decoded = this.getDecodedToken();
    if (!decoded) return false;

    // Check expiration if exists
    if (decoded.exp === undefined) return true;
    return decoded.exp > Date.now() / 1000;
  }

  // Logout
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.authSourceKey);
  }

  // Google signout
  async googleSignOut(): Promise<void> {
    if (typeof google !== 'undefined') {
      try {
        await google.accounts.id.disableAutoSelect();
        await google.accounts.id.revoke(localStorage.getItem('email'));
      } catch (error) {
        console.error('Google signout error:', error);
      }
    }
    this.logout();
  }

  // Password recovery
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(email: string, code: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { email, code, newPassword });
  }
}
