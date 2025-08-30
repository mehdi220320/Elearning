import {Component, OnInit} from '@angular/core';
import {ChapitreService} from '../../../services/chapitre.service';
import {Chapitre} from '../../../models/Chapitres';
import { saveAs } from 'file-saver';
interface FileResource {
  path: string;
  contentType: string;
  size: number;
  name: string;
}

interface Section {
  title: string;
  description: string;
  url: string;
  nombrePage: number;
  dureeVideo: number;
  file?: FileResource;
}

interface Course {
  _id: string;
  title: string;
}


interface ResourceItem {
  chapterTitle: string;
  sectionTitle: string;
  file: FileResource;
  createdAt: string;
}
@Component({
  selector: 'app-ressources-list',
  standalone: false,
  templateUrl: './ressources-list.component.html',
  styleUrl: './ressources-list.component.css'
})
export class RessourcesListComponent implements OnInit {
  chapitresWR: Chapitre[] = [];
  filteredChapters: Chapitre[] = [];
  courses: Course[] = [];
  resources: ResourceItem[] = [];
  filteredResources: ResourceItem[] = [];

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
        this.extractResources();
        this.extractCourses();
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  extractResources(): void {
    this.resources = [];
    this.chapitresWR.forEach(chapter => {
      chapter.section.forEach(section => {
        if (section.file) {
          this.resources.push({
            chapterTitle: chapter.title,
            sectionTitle: section.title,
            file: section.file,
            createdAt: chapter.createdAt
          });
        }
      });
    });
    this.filteredResources = [...this.resources];
  }

  extractCourses(): void {
    const courseMap = new Map<string, Course>();
    this.chapitresWR.forEach(chap => {
      if (chap.course) {
        courseMap.set(chap.course._id, chap.course);
      }
    });
    this.courses = Array.from(courseMap.values());
  }

  applyFilters(): void {
    const search = this.searchText.toLowerCase();

    // First filter chapters by course
    let tempChapters = this.chapitresWR;
    if (this.selectedCourse !== '') {
      tempChapters = this.chapitresWR.filter(chap =>
        chap.course && chap.course._id === this.selectedCourse
      );
    }

    // Then extract resources from filtered chapters and apply search filter
    this.filteredResources = [];
    tempChapters.forEach(chapter => {
      chapter.section.forEach(section => {
        if (section.file) {
          // Check if matches search text
          const matchesSearch = search === '' ||
            chapter.title.toLowerCase().includes(search) ||
            section.title.toLowerCase().includes(search) ||
            section.file.name.toLowerCase().includes(search) ||
            section.file.path.toLowerCase().includes(search);

          if (matchesSearch) {
            this.filteredResources.push({
              chapterTitle: chapter.title,
              sectionTitle: section.title,
              file: section.file,
              createdAt: chapter.createdAt
            });
          }
        }
      });
    });

    this.currentPage = 1;
  }

  resetFilters(): void {
    this.searchText = '';
    this.selectedCourse = '';
    this.applyFilters();
  }

  downloadFile(file: FileResource): void {
    if (!file) return;
    const fileName = file.path.split('/').pop() || 'resource';
    saveAs(file.path, fileName);
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
      case 'xls':
      case 'xlsx': return 'fas fa-file-excel text-success';
      case 'txt': return 'fas fa-file-alt text-secondary';
      case 'csv': return 'fas fa-file-csv text-info';
      default: return 'fas fa-file text-muted';
    }
  }

  getFileSize(bytes: number): string {
    if (!bytes) return '0 KB';
    if (bytes < 1024) return bytes + ' Bytes';
    if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / 1048576).toFixed(2) + ' MB';
  }

  get paginatedResources(): ResourceItem[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredResources.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number[] {
    return Array(Math.ceil(this.filteredResources.length / this.pageSize)).fill(0).map((_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages.length) {
      this.currentPage = page;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages.length) this.currentPage++;
  }
}
