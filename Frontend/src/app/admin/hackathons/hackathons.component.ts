import {Component, OnInit} from '@angular/core';
import {CategoryService} from '../../services/category.service';
import {HackathonService} from '../../services/hackathon.service';
import {Category} from '../../models/Category';
import {Hackathon} from '../../models/Hackathon';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-hackathons',
  standalone: false,
  templateUrl: './hackathons.component.html',
  styleUrl: './hackathons.component.css'
})
export class HackathonsComponent implements OnInit {
  themes: Category[] = [];
  hackathons: Hackathon[] = [];
  filteredHackathons: Hackathon[] = [];

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  // Filter properties
  statusFilter: string = '';
  themeFilter: string = '';
  searchFilter: string = '';

  constructor(
    private categoryService: CategoryService,
    private hackathonService: HackathonService,
    private sanitizer: DomSanitizer
) {}

  ngOnInit(): void {
    this.loadThemes();
    this.loadHackathons();
  }

  loadThemes(): void {
    this.categoryService.getAll().subscribe({
      next: (response) => this.themes = response
    });
  }

  loadHackathons(): void {
    this.hackathonService.getAll().subscribe({
      next: (response) => {
        this.hackathons = response;
        this.applyFilters();
      }
    });
  }

  applyFilters(): void {
    // Apply all filters
    this.filteredHackathons = this.hackathons.filter(hackathon => {
      // Status filter
      if (this.statusFilter && hackathon.status !== this.statusFilter) {
        return false;
      }

      // Theme filter
      if (this.themeFilter && hackathon.theme._id !== this.themeFilter) {
        return false;
      }

      // Search filter
      if (this.searchFilter) {
        const searchTerm = this.searchFilter.toLowerCase();
        const matchesTitle = hackathon.title.toLowerCase().includes(searchTerm);
        const matchesLocation = hackathon.location.toLowerCase().includes(searchTerm);
        const matchesDescription = hackathon.description.toLowerCase().includes(searchTerm);

        if (!matchesTitle && !matchesLocation && !matchesDescription) {
          return false;
        }
      }

      return true;
    });

    // Update pagination
    this.totalPages = Math.ceil(this.filteredHackathons.length / this.itemsPerPage);

    // Reset to first page if current page is beyond total pages
    if (this.currentPage > this.totalPages) {
    this.currentPage = 1;
  }
}

  onStatusFilterChange(event: any): void {
    this.statusFilter = event.target.value;
    this.applyFilters();
  }

  onThemeFilterChange(event: any): void {
    this.themeFilter = event.target.value;
    this.applyFilters();
  }

  onSearchFilterChange(event: any): void {
    this.searchFilter = event.target.value;
    this.applyFilters();
  }

  refreshData(): void {
    this.statusFilter = '';
    this.themeFilter = '';
    this.searchFilter = '';
    this.currentPage = 1;
    this.loadHackathons();
  }

  getPaginatedHackathons(): Hackathon[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredHackathons.slice(startIndex, startIndex + this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
  }
}

  getPageNumbers(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  getImage(url: string | null): SafeUrl | string {
    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : '/assets/img.png';
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'planned': return 'status-planned';
      case 'ongoing': return 'status-ongoing';
      case 'completed': return 'status-completed';
      case 'canceled': return 'status-canceled';
      default: return '';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'scheduled': return 'Planifié';
      case 'ongoing': return 'En cours';
      case 'completed': return 'Terminé';
      case 'canceled': return 'Annulé';
      default: return status;
    }
  }

  getThemeName(themeId: string): string {
    const theme = this.themes.find(t => t._id === themeId);
    return theme ? theme.name : 'Inconnu';
  }

  formatDateRange(startDate: string, endDate: string): string {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Format as "DD-MMM YYYY" or similar based on your preference
    return `${this.formatDate(start)} - ${this.formatDate(end)}`;
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  deleteHackathon(hackathonId: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce hackathon?')) {
    this.hackathonService.deleteHackathon(hackathonId).subscribe({
      next: () => {
        this.loadHackathons();
      },
      error: (err) => {
        console.error('Error deleting hackathon:', err);
      }
    });
  }
}

}
