import { Component } from '@angular/core';
import {InstructorService} from '../services/instructor.service';
import {Instructor} from '../models/Instructor';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {CategoryService} from '../services/category.service';
import {Category} from '../models/Category';

@Component({
  selector: 'app-instructors',
  standalone: false,
  templateUrl: './instructors.component.html',
  styleUrl: './instructors.component.css'
})
export class InstructorsComponent {
  instructors: Instructor[] = [];
  filteredInstructors: Instructor[] = [];

  searchTerm: string = '';
  selectedCategory: string = 'Tous';

  currentPage: number = 1;
  itemsPerPage: number = 6;
  categories:Category[]=[]
  constructor(private instructorService: InstructorService,private categoryService:CategoryService,private sanitizer:DomSanitizer) {}

  ngOnInit() {
    this.loadInstructors();
    this.loadCategories();
  }
  loadCategories(){
    this.categoryService.getAll().subscribe({
      next:(response)=>{
        this.categories=response;
      },error:(e)=>{console.error(e)}
    });

  }
  loadInstructors() {
    this.instructorService.getAll().subscribe({
      next: (response) => {
        this.instructors = response;
        this.applyFilters();
      },
      error: (err) => console.error(err)
    });
  }

  get totalPages(): number {
    return Math.ceil(this.filteredInstructors.length / this.itemsPerPage);
  }

  get totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  paginatedInstructors(): Instructor[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredInstructors.slice(start, end);
  }

  applyFilters(): void {
    console.log("categorie selected : "+this.selectedCategory)
    this.filteredInstructors = this.instructors.filter(instructor => {
      const fullName = `${instructor.firstname} ${instructor.lastname}`.toLowerCase();
      const matchesSearch = this.searchTerm === '' || fullName.includes(this.searchTerm.toLowerCase()) || instructor.speciality.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = this.selectedCategory === 'Tous' || instructor.categorie?.name === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
    this.currentPage = 1;
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  prevPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  getImagePath(path: string | null): SafeUrl | string {
    if (!path) return '/assets/img.png';
    return this.sanitizer.bypassSecurityTrustUrl(
      path.startsWith('http') ? path : `http://localhost:3000/${path}`
    );
  }

}
