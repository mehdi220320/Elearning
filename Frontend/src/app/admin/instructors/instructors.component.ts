import {Component, OnInit} from '@angular/core';
import {Instructor} from '../../models/Instructor';
import {InstructorService} from '../../services/instructor.service';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-instructors',
  standalone: false,
  templateUrl: './instructors.component.html',
  styleUrl: './instructors.component.css'
})
export class InstructorsComponent implements OnInit{
  instructors: Instructor[] = [];
  filteredInstructors: Instructor[] = [];
  paginatedInstructors: Instructor[] = [];
  searchTerm: string = '';

  // Pagination variables
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  constructor(
    private instructorService: InstructorService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.loadInstructors();
  }

  loadInstructors() {
    this.instructorService.getAll().subscribe({
      next: (response) => {
        this.instructors = response;
        this.filteredInstructors = [...this.instructors];
        this.updatePagination();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  deleteInstructor(id: string) {
    // Enhanced confirmation message in French
    const confirmationMessage = "Êtes-vous sûr de vouloir supprimer ce formateur ?\n\n" +
      "⚠️ Attention : Cette action supprimera également :\n" +
      "• Tous les cours créés par ce formateur\n" +
      "• Tous les chapitres de ces cours\n" +
      "• Tous les tests et évaluations associés\n" +
      "• Les progressions des étudiants dans ces cours\n\n" +
      "Cette action est irréversible.";

    if (confirm(confirmationMessage)) {
      this.instructorService.deleteById(id).subscribe({
        next: (response) => {
          console.log(response);
          console.log("Formateur supprimé avec succès");
          // Remove from local arrays instead of reloading all data
          this.instructors = this.instructors.filter(instructor => instructor._id !== id);
          this.filteredInstructors = this.filteredInstructors.filter(instructor => instructor._id !== id);
          this.updatePagination();
        },
        error: (err) => {
          console.error(err);
          alert('Erreur lors de la suppression du formateur. Veuillez réessayer.');
        }
      });
    }
  }

  getImage(url: string | null): SafeUrl | string {
    return url ?
      this.sanitizer.bypassSecurityTrustResourceUrl(url) :
      '/assets/img.png';
  }

  applyFilter() {
    if (!this.searchTerm) {
      this.filteredInstructors = [...this.instructors];
    } else {
      const searchTermLower = this.searchTerm.toLowerCase();
      this.filteredInstructors = this.instructors.filter(instructor =>
        instructor.firstname.toLowerCase().includes(searchTermLower) ||
        instructor.lastname.toLowerCase().includes(searchTermLower) ||
        instructor.email.toLowerCase().includes(searchTermLower) ||
        instructor.speciality.toLowerCase().includes(searchTermLower) ||
        instructor.Competences.some(skill => skill.toLowerCase().includes(searchTermLower))
      );
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  // Pagination methods
  updatePagination() {
    this.totalPages = Math.ceil(this.filteredInstructors.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedInstructors = this.filteredInstructors.slice(startIndex, endIndex);
  }

  getPages(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;

    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, this.currentPage - 2);
      let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }
}
