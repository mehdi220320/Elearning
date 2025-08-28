import {Component, HostListener} from '@angular/core';
import {SidebarService} from './services/sidebar.service';
import {AuthService} from '../services/authServices/auth.service';
import {NavigationEnd, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
declare var google:any;

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  constructor(private authService: AuthService,
              private sidebarService: SidebarService,
              private sanitizer:DomSanitizer,
              private router: Router) {}
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
  toggleSubmenu: boolean = false;

  toggleDropdown(menuId: string, event: Event) {
    event.preventDefault();
    this.sidebarService.toggleDropdown(menuId);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!(event.target as HTMLElement).closest('.has-dropdown') &&
      !(event.target as HTMLElement).closest('.submenu')) {
      this.sidebarService.closeAllDropdowns();
    }
  }
  email:any=""
  picture:any=""
  ngOnInit(){
    this.picture=  this.authService.getUserPicture() ? this.authService.getUserPicture() : "";
    this.email=  this.authService.getUserEmail() ? this.authService.getUserEmail() : "";
  }
  getImageUser(): SafeUrl | string {
    return this.picture!=="" ?
      this.sanitizer.bypassSecurityTrustResourceUrl(this.picture) :
      '/assets/img.png';
  }


}
