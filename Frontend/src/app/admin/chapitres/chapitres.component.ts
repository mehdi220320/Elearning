import { Component } from '@angular/core';
import {Chapitre} from '../../models/Chapitres';
import {ChapitreService} from '../../services/chapitre.service';
import {Course} from '../../models/Course';
import {CourseService} from '../../services/course.service';

@Component({
  selector: 'app-chapitres',
  standalone: false,
  templateUrl: './chapitres.component.html',
  styleUrl: './chapitres.component.css'
})
export class ChapitresComponent {
  chapters: Chapitre[] = [];
  filteredChapters: Chapitre[] = [];
  courses: Course[] = [];

  searchText: string = '';
  selectedCourse: string = '';
  currentPage: number = 1;
  pageSize: number = 5;

  constructor(
    private chapitreService: ChapitreService,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.loadChapters();
    this.loadCourses();
  }

  loadChapters(): void {
    this.chapitreService.getAll().subscribe({
      next: (response) => {
        this.chapters = response;
        this.applyFilters();
      },
      error: (err) => console.error(err),
    });
  }

  loadCourses(): void {
    this.courseService.getAll().subscribe({
      next: (response) => {
        this.courses = response;
      },
      error: (err) => console.error(err),
    });
  }

  applyFilters(): void {
    const search = this.searchText.toLowerCase();

    this.filteredChapters = this.chapters.filter(chap => {
      const matchesSearch = chap.title.toLowerCase().includes(search);
      const matchesCourse = this.selectedCourse === '' || chap.course?._id === this.selectedCourse;
      return matchesSearch && matchesCourse;
    });

    this.currentPage = 1;
  }

  resetFilters(): void {
    this.searchText = '';
    this.selectedCourse = '';
    this.applyFilters();
  }

  get paginatedChapters(): Chapitre[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredChapters.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number[] {
    return Array(Math.ceil(this.filteredChapters.length / this.pageSize)).fill(0).map((_, i) => i + 1);
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  prevPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages.length) this.currentPage++;
  }

  getHoursPagesStr(nb: any, vid: any): string {
    let str: string = ''
    if (!nb && vid === '') { return '-' }
    if (nb && vid !== '') { return nb + ' pages ' + '- ' + vid + "h" }
    if (nb) {
      str = nb + ' pages'
    }
    if (vid !== '') {
      str = vid + "h"
    }
    return str
  }
  getFileIconClass(file: any ): string {
    if (!file) return '';
    const ext = file.split('.').pop()?.toLowerCase();

    switch (ext) {
      case 'pdf':
        return 'fas fa-file-pdf text-danger';
      case 'doc':
      case 'docx':
        return 'fas fa-file-word text-primary';
      case 'txt':
        return 'fas fa-file-alt text-secondary';
      case 'csv':
        return 'fas fa-file-csv text-success';
      default:
        return 'fas fa-file text-muted';
    }
  }

}
