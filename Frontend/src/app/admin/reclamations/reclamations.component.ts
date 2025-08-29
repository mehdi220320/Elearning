import {Component, OnInit, ViewChild} from '@angular/core';
import {ReclamationService} from '../../services/reclamation.service';
import {Reclamation} from '../../models/Reclamation';

@Component({
  selector: 'app-reclamations',
  standalone: false,
  templateUrl: './reclamations.component.html',
  styleUrl: './reclamations.component.css'
})
export class ReclamationsComponent implements OnInit {
  reclamations: Reclamation[] = [];
  filteredReclamations: Reclamation[] = [];

  // 🔎 Recherche + filtres
  searchTerm: string = '';
  selectedType: string = 'Tous les types';
  selectedStatus: string = 'Tous les statuts';

  // 📑 Pagination
  currentPage: number = 1;
  itemsPerPage: number = 5;

  constructor(private reclamationService: ReclamationService) {}

  ngOnInit() {
    this.loadReclamations();
  }

  loadReclamations() {
    this.reclamationService.getAll().subscribe({
      next: (res) => {
        this.reclamations = res;
        this.applyFilters();
      },
      error: (err) => console.error(err)
    });
  }

  // 🔥 Appliquer recherche et filtres
  applyFilters() {
    this.filteredReclamations = this.reclamations.filter(r => {
      const matchSearch =
        r.sujet.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        r.creator.firstname.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        r.creator.lastname.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchType =
        this.selectedType === 'Tous les types' || this.typeConcernant(r) === this.selectedType;

      const matchStatus =
        this.selectedStatus === 'Tous les statuts' ||
        (this.selectedStatus === '1' && !r.seen) ||
        (this.selectedStatus === '2' && r.seen);

      return matchSearch && matchType && matchStatus;
    });
  }

  // 📑 Pagination helpers
  get totalPages(): number {
    return Math.ceil(this.filteredReclamations.length / this.itemsPerPage);
  }

  get paginatedReclamations(): Reclamation[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredReclamations.slice(start, start + this.itemsPerPage);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPendingCount(): number {
    return this.reclamations.filter(r => !r.seen).length;
  }


  getHackathonCount(): number {
    return this.reclamations.filter(r =>
      this.typeConcernant(r) === 'Hackathon' || this.typeConcernant(r) === 'Les deux').length;
  }
  getCoursesCount(): number {
    return this.reclamations.filter(r =>
      this.typeConcernant(r) === 'Course' || this.typeConcernant(r) === 'Les deux').length;
  }

// Format date for display
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

// Format date and time for modal display
  formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }


  getPages(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }
  typeConcernant(reclamation:Reclamation):string{
    console.log(reclamation)
    if(reclamation.cours!==undefined && reclamation.hackathon!==undefined){
      return "Les deux"
    }else if(reclamation.cours!==undefined){
      return "Cours"
    }else if(reclamation.hackathon){
      return "Hackathon"
    }else{
      return  reclamation.type
    }
  }
}
