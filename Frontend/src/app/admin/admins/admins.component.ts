import {Component, OnInit} from '@angular/core';
import {UsersService} from '../../services/users.service';
import {User} from '../../models/User';

@Component({
  selector: 'app-admins',
  standalone: false,
  templateUrl: './admins.component.html',
  styleUrl: './admins.component.css'
})
export class AdminsComponent implements OnInit {
  admins: User[] = [];
  isLoading = true;
  errorMessage = '';
  showDeleteAlert = false;
  adminToDelete: User | null = null;

  constructor(private userServices: UsersService) {}

  ngOnInit(): void {
    this.loadAdmins();
  }

  loadAdmins(): void {
    this.isLoading = true;
    this.userServices.getAdmins().subscribe({
      next: (admins) => {
        this.admins = admins;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des administrateurs';
        this.isLoading = false;
        console.error('Error loading admins:', error);
      }
    });
  }

  openDeleteAlert(admin: User): void {
    this.adminToDelete = admin;
    this.showDeleteAlert = true;
  }

  closeDeleteAlert(): void {
    this.showDeleteAlert = false;
    this.adminToDelete = null;
  }

  confirmDelete(): void {
    if (this.adminToDelete && this.adminToDelete._id) {
      this.userServices.deleteAdmin(this.adminToDelete._id).subscribe({
        next: () => {
          this.admins = this.admins.filter(admin => admin._id !== this.adminToDelete!._id);
          this.closeDeleteAlert();
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la suppression de l\'administrateur';
          console.error('Error deleting admin:', error);
          this.closeDeleteAlert();
        }
      });
    }
  }

  getInitials(firstname: string, lastname: string): string {
    return `${firstname?.charAt(0) || ''}${lastname?.charAt(0) || ''}`.toUpperCase();
  }
}
