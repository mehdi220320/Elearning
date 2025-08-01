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
  courses:Course[]=[]
  url:string=""
  duree:string=""
  nbpages:string="";

  description:string=""
  title:string="";
  coursId:string="";
   error: string |null ="";
  constructor(private courseService:CourseService,
              private location: Location,
              private router:Router,
              private chapiterService:ChapitreService) {
  }

  ngOnInit(){
    this.loadData()
  }

  active=[true,false,false]
  isLoading: boolean=false;
  activate(index:number){
    for (let i = 0; i < 3; i++) {
      if(i===index){
        this.active[i]=true;
      }else this.active[i]=false
      switch (index) {
        case 0:
          this.nbpages = "";
          this.selectedFile = null;
          break;

        case 1:
          this.url = "";
          this.duree = "";
          break;

        default:
          break;
      }

    }
  }
  loadData(): void {
    this.courseService.getAll().subscribe({
      next: (response: Course[]) => {
        this.courses = response;
      },
      error: (err) => console.error(err),
    });
  }
  selectedFile: File | null = null;
  fileMetadata: { path: string; contentType: string ,size:number } | null = null;
  filename="";
  filesize:any="";
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (file.size > 10 * 1024 * 1024) { // 10MB max
        alert('Le fichier dépasse la taille maximale de 10MB.');
        return;
      }

      this.selectedFile = file;
      this.filename=this.selectedFile?.name
      this.filesize=this.selectedFile?.size
      // Prepare metadata for backend
      this.fileMetadata = {
        path: file.name,
        contentType: file.type,
        size:file.size
      };
    }
  }

  removeFile(): void {
    this.selectedFile = null;
    this.fileMetadata = null;

    // Optional: Clear file input manually
    const fileInput = document.getElementById('pdf-file') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }
  getFileIconClass(file: File | null): string {
    if (!file) return '';

    const ext = file.name.split('.').pop()?.toLowerCase();

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

  onSubmit(form: NgForm) {
    if (form.invalid) {
      this.error = "Veuillez remplir tous les champs obligatoires correctement";
      return;
    }
    const formData = new FormData();

    if(this.url!==""){    formData.append('url', this.url);}
    if(this.duree!==""){        formData.append('dureeVideo', this.duree);}
    if(this.nbpages!==""){        formData.append('nombrePage', this.nbpages);}
    formData.append('title', this.title);
    formData.append('courseId', this.coursId);
    formData.append('description', this.description);
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }
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
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/admin/chapters']);
    }
  }

}
