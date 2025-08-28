import { Component } from '@angular/core';
import {AuthService} from '../services/authServices/auth.service';
import {Router} from '@angular/router';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
declare var google:any;

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(private authService: AuthService,
              private router: Router,
              private  sanitizer:DomSanitizer) {}
  isAdmin():boolean{
    return this.authService.getUserRole()==='admin';
  }
  picture:any=""
  ngOnInit(){
    this.picture=  this.authService.getUserPicture() ? this.authService.getUserPicture() : ""
  }
  getImageUser(): SafeUrl | string {
    return this.picture!=="" ?
      this.sanitizer.bypassSecurityTrustResourceUrl(this.picture) :
      '/assets/img.png';
  }
  logout(): void {
    this.authService.logout();

    if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
      try {
        google.accounts.id.disableAutoSelect();
        google.accounts.id.revoke(localStorage.getItem('email'), (done: {success: boolean})  => {
          console.log('Google session revoked');
        });
      } catch (e) {
        console.warn('Google Sign-Out error:', e);
      }
    }

    localStorage.clear();
    console.log("aw wselna taw")
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });

  }

}

