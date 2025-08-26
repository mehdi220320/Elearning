import {Component, OnInit} from '@angular/core';
import {Hackathon} from '../models/Hackathon';
import {Category} from '../models/Category';
import {CategoryService} from '../services/category.service';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {HackathonService} from '../services/hackathon.service';

@Component({
  selector: 'app-hackthons',
  standalone: false,
  templateUrl: './hackthons.component.html',
  styleUrl: './hackthons.component.css'
})
export class HackthonsComponent implements OnInit {
  themes: Category[] = [];
  hackathons: Hackathon[] = [];
  filteredHackathons: Hackathon[] = [];

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 9;
  totalPages: number = 1;

  // Filter properties
  themeFilter: string = '';
  searchFilter: string = '';

  constructor(
    private categoryService: CategoryService,
    private hackathonService: HackathonService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'instant' });
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
      // Theme filter
      if (this.themeFilter && hackathon.theme._id !== this.themeFilter) {
        return false;
      }

      // Search filter
      if (this.searchFilter) {
        const searchTerm = this.searchFilter.toLowerCase();
        const matchesTitle = hackathon.title.toLowerCase().includes(searchTerm);
        const matchesLocation = hackathon.location.toLowerCase().includes(searchTerm);
        const matchesTheme = this.getThemeName(hackathon.theme._id).toLowerCase().includes(searchTerm);

        if (!matchesTitle && !matchesLocation && !matchesTheme) {
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

  onThemeFilterChange(event: any): void {
    this.themeFilter = event.target.value;
    this.applyFilters();
  }

  onSearchFilterChange(event: any): void {
    this.searchFilter = event.target.value;
    this.applyFilters();
  }

  refreshData(): void {
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
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > this.totalPages) {
      endPage = this.totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  getImage(url: string | null): SafeUrl | string {
    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80';
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
      case 'planned': return 'Planifié';
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

    return `${this.formatDate(start)} - ${this.formatDate(end)}`;
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }
}
