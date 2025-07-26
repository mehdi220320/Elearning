import { Component } from '@angular/core';
import {User} from '../../models/User';
import {UsersService} from '../../services/users.service';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-users',
  standalone: false,
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  users: User[] = [];
  filteredUsers: User[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  searchTerm = '';
  sortColumn = '';
  sortDirection = 'asc';
  monthlyGrowthPercentage: number = 0;
  instructors:any[]=[]
  constructor(private userService: UsersService,private sanitizer:DomSanitizer) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAll().subscribe({
      next: (res) => {
        this.users = res;
        this.filteredUsers = [...this.users];
        this.applyFilter();
        this.calculateMonthlyGrowth();
      },
      error: (err) => console.error("Can't fetch data", err)
    });
  }

  applyFilter() {
    if (!this.searchTerm) {
      this.filteredUsers = [...this.users];
    } else {
      this.filteredUsers = this.users.filter(user =>
        Object.values(user).some(val =>
          val?.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
        )
      );
    }
    this.currentPage = 1; // Reset to first page when filtering
  }

  sort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredUsers.sort((a, b) => {
      const valA = a[column as keyof User];
      const valB = b[column as keyof User];

      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  }

  get paginatedUsers(): User[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredUsers.slice(startIndex, startIndex + this.itemsPerPage);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }


  getImage(url: string  | null): SafeUrl | string {
    return url ?
      this.sanitizer.bypassSecurityTrustResourceUrl(url) :
      '/assets/img.png';
  }

  changeItemsPerPage(count: number) {
    this.itemsPerPage = count;
    this.currentPage = 1;
  }
  get totalUsers(): number {
    return this.users.length;
  }

  get activeUsers(): number {
    return this.users.filter(u => u.isActive).length;
  }

  get inactiveUsers(): number {
    return this.users.filter(u => !u.isActive).length;
  }
  calculateMonthlyGrowth(): void {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Compter les utilisateurs du mois courant
    const currentMonthUsers = this.users.filter(user => {
      const userDate = new Date(user.createdAt);
      return userDate.getMonth() === currentMonth &&
        userDate.getFullYear() === currentYear;
    }).length;

    // Compter les utilisateurs du mois précédent
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const prevMonthUsers = this.users.filter(user => {
      const userDate = new Date(user.createdAt);
      return userDate.getMonth() === prevMonth &&
        userDate.getFullYear() === prevYear;
    }).length;

    // Calculer le pourcentage de croissance
    if (prevMonthUsers > 0) {
      this.monthlyGrowthPercentage = Math.round(currentMonthUsers - prevMonthUsers
      );
    } else {
      // Cas où il n'y avait pas d'utilisateurs le mois précédent
      this.monthlyGrowthPercentage = currentMonthUsers > 0 ? 100 : 0;
    }
  }
  isActiveUpdate(user:User){
    user.isActive=!user.isActive
    this.userService.updateUserActive(user._id).subscribe(
      {next:(res)=>{
        console.log("user Activation :"+user.isActive);
        this.loadUsers();
      },
        error:(err)=>{console.error(err)}
      }
    );
  }






}
