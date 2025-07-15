import { Component } from '@angular/core';
import {AuthService} from '../services/auth.service';
import {SidebarService} from '../admin/services/sidebar.service';
import {Router} from '@angular/router';
declare var google:any;

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private authService: AuthService,
              private sidebarService: SidebarService,
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

}
