import { Component } from '@angular/core';
import {ChapitreService} from '../../../services/chapitre.service';
import {Chapitre} from '../../../models/Chapitres';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-ressources-list',
  standalone: false,
  templateUrl: './ressources-list.component.html',
  styleUrl: './ressources-list.component.css'
})
export class RessourcesListComponent {
  chapitresWR: Chapitre[] = [];
  filteredChapters: Chapitre[] = [];
  courses: {_id: string, title: string}[] = [];

  searchText: string = '';
  selectedCourse: string = '';
  currentPage: number = 1;
  pageSize: number = 5;
  isLoading: boolean = false;

  constructor(private chapitreService: ChapitreService) {}

  ngOnInit() {
    this.loadChapters();
  }

  loadChapters(): void {
    this.isLoading = true;
    this.chapitreService.getChaptersWithRessouces().subscribe({
      next: (response: Chapitre[]) => {
        this.chapitresWR = response;
        this.filteredChapters = response;
        this.extractCourses();
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  extractCourses(): void {
    const courseMap = new Map<string, {_id: string, title: string}>();
    this.chapitresWR.forEach(chap => {
      if (chap.course) {
        courseMap.set(chap.course._id, chap.course);
      }
    });
    this.courses = Array.from(courseMap.values());
  }

  applyFilters(): void {
    const search = this.searchText.toLowerCase();

    this.filteredChapters = this.chapitresWR.filter(chap => {
      const matchesSearch = chap.title.toLowerCase().includes(search) ||
        chap.section.some(sec => sec.file && sec.file.path.toLowerCase().includes(search));
      const matchesCourse = this.selectedCourse === '' ||
        (chap.course && chap.course._id === this.selectedCourse);
      return matchesSearch && matchesCourse;
    });

    this.currentPage = 1;
  }

  resetFilters(): void {
    this.searchText = '';
    this.selectedCourse = '';
    this.applyFilters();
  }

  downloadFile(section: { file?: any }): void {
    if (!section.file) return;

    const fileName = section.file.path.split('/').pop() || 'resource';
    saveAs(section.file.path, fileName);
  }

  getFileType(contentType: string): string {
    if (!contentType) return 'file';
    if (contentType.includes('pdf')) return 'pdf';
    if (contentType.includes('word')) return 'word';
    if (contentType.includes('excel') || contentType.includes('spreadsheet')) return 'excel';
    if (contentType.includes('text')) return 'text';
    if (contentType.includes('csv')) return 'csv';
    return 'file';
  }

  getFileIconClass(filePath: string): string {
    if (!filePath) return '';
    const ext = filePath.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return 'fas fa-file-pdf text-danger';
      case 'doc':
      case 'docx': return 'fas fa-file-word text-primary';
      case 'txt': return 'fas fa-file-alt text-secondary';
      case 'csv': return 'fas fa-file-csv text-success';
      default: return 'fas fa-file text-muted';
    }
  }

  getFileSize(bytes: number): string {
    if (!bytes) return '0 KB';
    return (bytes / 1024).toFixed(2) + ' KB';
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
}
