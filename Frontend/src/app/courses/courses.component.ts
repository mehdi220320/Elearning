import { Component } from '@angular/core';
import {Course} from '../models/Course';
import {CourseService} from '../services/course.service';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-courses',
  standalone: false,
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent {
  courses: Course[] = [];
  filteredCourses: Course[] = [];

  searchTerm: string = '';
  selectedCategory: string = '';
  selectedLevel: string = '';
  selectedLangue: string = '';
  filterMode: string = 'all';
  sortOption: string = 'pertinence';

  currentPage: number = 1;
  itemsPerPage: number = 6;

  allCategories: string[] = [];

  constructor(private coursService: CourseService, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.loadData();
  }

  loadData(): void {
    this.coursService.getAll().subscribe({
      next: (response: Course[]) => {
        this.courses = response;
        this.allCategories = [...new Set(response.map(c => c.categorie?.name).filter(Boolean))];
        this.applyFilters();
      },
      error: (err) => console.error(err),
    });
  }

  getImage(path: string | null): SafeUrl | string {
    if (!path) return '/assets/img.png';
    return this.sanitizer.bypassSecurityTrustUrl(
      path.startsWith('http') ? path : `http://localhost:3000/${path}`
    );
  }

  // Apply all filters
  applyFilters(): void {
    this.filteredCourses = this.courses.filter(course => {
      const matchesTitle = this.searchTerm
        ? course.title.toLowerCase().includes(this.searchTerm.toLowerCase())
        : true;
      const matchesCategory = this.selectedCategory
        ? course.categorie?.name === this.selectedCategory
        : true;
      const matchesLevel = this.selectedLevel ? course.niveau === this.selectedLevel : true;
      const matchesLangue = this.selectedLangue ? course.langue === this.selectedLangue : true;

      let matchesMode = true;
      if (this.filterMode === 'paid') matchesMode = course.prix > 0;
      else if (this.filterMode === 'free') matchesMode = (course.prix === 0 || !course.prix) ;
      else if (this.filterMode === 'certified') matchesMode = course.certificat === true;

      return (
        matchesTitle &&
        matchesCategory &&
        matchesLevel &&
        matchesLangue &&
        matchesMode
      );
    });

    this.sortCourses();
    this.currentPage = 1;
  }

  searchCourses(): void {
    this.applyFilters();
  }

  filterCourses(): void {
    this.applyFilters();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.selectedLevel = '';
    this.selectedLangue = '';
    this.filterMode = 'all';
    this.sortOption = 'pertinence';
    this.applyFilters();
  }

  // Sorting
  sortCourses(): void {
    this.filteredCourses.sort((a, b) => {
      switch (this.sortOption) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'rating':
          return b.rating - a.rating;
        case 'priceLow':
          return a.prix - b.prix;
        case 'priceHigh':
          return b.prix - a.prix;
        default:
          return 0; // Default: no sorting (pertinence)
      }
    });
  }

  // Pagination helpers
  paginatedCourses(): Course[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredCourses.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredCourses.length / this.itemsPerPage);
  }

  get totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}
