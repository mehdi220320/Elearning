import { Component } from '@angular/core';
import {TestService} from '../../../services/test.service';
import {CourseService} from '../../../services/course.service';
import {ChapitreService} from '../../../services/chapitre.service';

@Component({
  selector: 'app-test-list',
  standalone: false,
  templateUrl: './test-list.component.html',
  styleUrl: './test-list.component.css'
})
export class TestListComponent {
  tests: any[] = [];
  courses: any[] = [];
  chapters: any[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
  showDeleteModal = false;
  testToDelete: string | null = null;

  constructor(
    private testService: TestService,
    private courseService: CourseService,
    private chapterService: ChapitreService
  ) {}

  ngOnInit(): void {
    this.loadTests();
    this.loadCourses();
    this.loadChapters();
  }
  isLoading = true;
  errorMessage = ''
  loadTests(): void {
    this.isLoading = true;
    this.testService.getAllTests().subscribe({
      next: (response) => {
        this.tests = response.data.tests;
        this.totalPages = Math.ceil(this.tests.length / this.itemsPerPage);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des tests', err);
        this.errorMessage = 'Échec du chargement des tests';
        this.isLoading = false;
      }
    });
  }

  get paginatedTests(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.tests.slice(startIndex, endIndex);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
  loadCourses(): void {
    this.courseService.getAll()
      .subscribe({
        next: (courses) => {
          this.courses = courses;
        },
        error: (err) => {
          console.error('Failed to load courses', err);
        }
      });
  }

  loadChapters(): void {
    this.chapterService.getAll()
      .subscribe({
        next: (chapters) => {
          this.chapters = chapters;
        },
        error: (err) => {
          console.error('Failed to load chapters', err);
        }
      });
  }





  viewTest(testId: string): void {
    // Navigation vers la page de visualisation
    console.log('View test', testId);
  }

  editTest(testId: string): void {
    // Navigation vers la page d'édition
    console.log('Edit test', testId);
  }

  confirmDelete(testId: string): void {
    this.testToDelete = testId;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.testToDelete = null;
    this.showDeleteModal = false;
  }

  deleteTest(): void {
    if (this.testToDelete) {
      this.testService.deleteTest(this.testToDelete)
        .subscribe({
          next: () => {
            this.loadTests();
            this.cancelDelete();
          },
          error: (err) => {
            console.error('Failed to delete test', err);
            this.cancelDelete();
          }
        });
    }
  }

}
