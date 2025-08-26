import { Component } from '@angular/core';
import {Course} from '../../../models/Course';
import {CourseService} from '../../../services/course.service';
import {NgForm} from '@angular/forms';
import {ChapitreService} from '../../../services/chapitre.service';
import {Location} from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-add-chapitre',
  standalone: false,
  templateUrl: './add-chapitre.component.html',
  styleUrl: './add-chapitre.component.css'
})
export class AddChapitreComponent {
  courses: Course[] = [];
  description: string = "";
  title: string = "";
  coursId: string = "";
  error: string | null = "";

  sections: Section[] = [
    {
      title: '',
      description: '',
      type: 'video',
      url: '',
      duree: '',
      nbpages: '',
      selectedFile: null,
      filename: '',
      filesize: 0,
      hideContent: false // Nouvelle propriété pour masquer/afficher le contenu
    }
  ];

  constructor(
    private courseService: CourseService,
    private location: Location,
    private router: Router,
    private chapiterService: ChapitreService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  isLoading: boolean = false;

  addSection() {
    this.sections.push({
      title: '',
      description: '',
      type: 'video',
      url: '',
      duree: '',
      nbpages: '',
      selectedFile: null,
      filename: '',
      filesize: 0,
      hideContent: false // Par défaut, le contenu est masqué
    });
  }

  removeSection(index: number) {
    if (this.sections.length > 1) this.sections.splice(index, 1);
  }

  toggleContentSection(index: number) {
    this.sections[index].hideContent = !this.sections[index].hideContent;
  }

  changeSectionType(index: number, type: string) {
    this.sections[index].type = type;
    if (type === 'video') {
      this.sections[index].nbpages = '';
      this.sections[index].selectedFile = null;
    } else if (type === 'pdf' || type === 'image') {
      this.sections[index].url = '';
      this.sections[index].duree = '';
    }
  }

  loadData(): void {
    this.courseService.getAll().subscribe({
      next: (response: Course[]) => this.courses = response,
      error: (err) => console.error(err)
    });
  }

  onFileSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.size > 10 * 1024 * 1024) {
        alert('Le fichier dépasse 10MB.');
        return;
      }
      this.sections[index].selectedFile = file;
      this.sections[index].filename = file.name;
      this.sections[index].filesize = file.size;
    }
  }

  removeFile(index: number): void {
    this.sections[index].selectedFile = null;
    this.sections[index].filename = '';
    this.sections[index].filesize = 0;
    // Réinitialiser les deux types d'inputs de fichiers (pdf et image)
    const pdfFileInput = document.getElementById(`pdf-file-${index}`) as HTMLInputElement;
    const imageFileInput = document.getElementById(`image-file-${index}`) as HTMLInputElement;
    if (pdfFileInput) pdfFileInput.value = '';
    if (imageFileInput) imageFileInput.value = '';
  }

  getFileIconClass(file: File | null): string {
    if (!file) return '';
    const ext = file.name.split('.').pop()?.toLowerCase();

    // Vérifier d'abord si c'est une image
    if (file.type.startsWith('image/')) {
      return 'fas fa-file-image text-info';
    }

    // Ensuite vérifier les autres types
    switch (ext) {
      case 'pdf': return 'fas fa-file-pdf text-danger';
      case 'doc':
      case 'docx': return 'fas fa-file-word text-primary';
      case 'txt': return 'fas fa-file-alt text-secondary';
      case 'csv': return 'fas fa-file-csv text-success';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'bmp':
      case 'webp':
      case 'svg': return 'fas fa-file-image text-info';
      default: return 'fas fa-file text-muted';
    }
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      this.error = "Veuillez remplir tous les champs obligatoires correctement";
      return;
    }

    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('courseId', this.coursId);
    formData.append('description', this.description);

    // Prepare sections metadata (without files)
    const sectionsData = this.sections.map(section => ({
      title: section.title,
      description: section.description,
      type: section.type, // Ajout du type de section
      url: section.url,
      dureeVideo: section.duree,
      nombrePage: section.nbpages
    }));
    formData.append('sections', JSON.stringify(sectionsData));

    // Attach all files under the same field 'files'
    this.sections.forEach(section => {
      if (section.selectedFile) {
        formData.append('files', section.selectedFile);
      }
    });

    this.isLoading = true;
    this.error = null;

    this.chapiterService.add(formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        alert("Le chapitre a été ajouté avec succès !");
        this.router.navigate(['/admin/chapters']);
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;

        if (err.status === 409) {
          this.error = "Ce chapitre existe déjà.";
        } else if (err.status === 400) {
          this.error = "Les données envoyées sont invalides.";
        } else if (err.status === 404) {
          this.error = "Le cours associé est introuvable.";
        } else {
          this.error = "Une erreur serveur s'est produite. Veuillez réessayer plus tard.";
        }
      }
    });
  }

  goBackOrFallback() {
    if (window.history.length > 1) this.location.back();
    else this.router.navigate(['/admin/chapters']);
  }
}


interface Section {
  title: string;
  description: string;
  type: string; // video, pdf, both
  url: string;
  duree: string; // mapped to backend dureeVideo
  nbpages: string;
  selectedFile: File | null;
  filename: string;
  filesize: number;
  hideContent: boolean;

}
