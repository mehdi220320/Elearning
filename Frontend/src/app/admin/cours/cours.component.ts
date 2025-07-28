import {Component, OnInit} from '@angular/core';
import {CourseService} from '../../services/course.service';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {Course} from '../../models/Course';

@Component({
  selector: 'app-cours',
  standalone: false,
  templateUrl: './cours.component.html',
  styleUrl: './cours.component.css'
})
export class CoursComponent implements OnInit {
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  paginatedCourses: Course[] = [];
  searchTerm = '';
  selectedStatus = '';
  selectedCategory = '';

  categoryOptions: string[] = [];

  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;

  totalCourses = 0;
  activeCourses = 0;
  draftCourses = 0;
  popularCourses = 0;

  constructor(private courseService: CourseService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.courseService.getAll().subscribe({
      next: (response: Course[]) => {
        this.courses = response;
        this.categoryOptions = [...new Set(this.courses.map(c => c.categorie.name))];
        this.filterCourses();
        this.calculateStats();
      },
      error: (err) => console.error(err),
    });
  }

  calculateStats(): void {
    this.totalCourses = this.courses.length;
    this.activeCourses = this.courses.filter(c => c.status).length;
    this.draftCourses = this.courses.filter(c => !c.status).length;
    this.popularCourses = this.courses.filter(c => c.prix > 100).length;
  }

  filterCourses(): void {
    let result = this.courses;

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(course =>
        course.title.toLowerCase().includes(term) ||
        course.formateur?.firstname.toLowerCase().includes(term) ||
        course.formateur?.lastname.toLowerCase().includes(term) ||
        course.categorie?.name.toLowerCase().includes(term)
      );
    }

    if (this.selectedStatus) {
      result = result.filter(c =>
        this.selectedStatus === 'active' ? c.status : !c.status
      );
    }

    if (this.selectedCategory) {
      result = result.filter(c => c.categorie.name === this.selectedCategory);
    }

    this.filteredCourses = result;
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredCourses.length / this.itemsPerPage);
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedCourses = this.filteredCourses.slice(start, end);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  getImage(url: string | null): SafeUrl | string {
    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : '/assets/img.png';
  }
}

