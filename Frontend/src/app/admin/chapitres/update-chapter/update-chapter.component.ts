import {Component,ViewChild} from '@angular/core';
import {Course} from '../../../models/Course';
import {CourseService} from '../../../services/course.service';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {ChapitreService} from '../../../services/chapitre.service';
import {NgForm} from '@angular/forms';
import {Chapitre} from '../../../models/Chapitres';

@Component({
  selector: 'app-update-chapter',
  standalone: false,
  templateUrl: './update-chapter.component.html',
  styleUrl: './update-chapter.component.css'
})
export class UpdateChapterComponent  {
  @ViewChild('addchapitreForm') addchapitreForm!: NgForm;
  chapter:Chapitre={_id:"",
    title: "",
    description: "",
    section: [
      {
        title:"",
        description:"",
        url: "",
        nombrePage: 0,
        dureeVideo: 0,
        file: {
          path: "",
          contentType: "",
          size:0,
          name:""
        }
      }
    ],

    course: {_id:"",title:""},
    createdAt: ""};
  courses: Course[] = [];
  description: string = "";
  title: string = "";
  coursId: string = "";
  error: string | null = "";
  chapitreId: string = "";
  isEditMode: boolean = false;
  isFormLoaded: boolean = false;

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
      hideContent: false,
      existingFile: null
    }
  ];

  constructor(
    private courseService: CourseService,
    private location: Location,
    private router: Router,
    private chapitreService: ChapitreService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadData();

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.chapitreId = params['id'];
        this.isEditMode = true;
        this.loadChapitreData();
      } else {
        this.isFormLoaded = true;
      }
    });
    console.log("ahawa men hgna "+this.chapter.course._id)
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
      hideContent: false,
      existingFile: null
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

  loadChapitreData(): void {
    this.isLoading = true;
    console.log("9bal "+this.chapitreId)

    this.chapitreService.getChapterById(this.chapitreId).subscribe({
      next: (chapitre: Chapitre) => {
        this.chapter=chapitre;
        this.title = chapitre.title;
        this.description = chapitre.description || '';
        this.coursId = chapitre.course._id;
        if (chapitre.section && chapitre.section.length > 0) {
          this.sections = chapitre.section.map((sec: any) => ({
            title: sec.title || '',
            description: sec.description || '',
            type: sec.url ? (sec.file ? 'both' : 'video') : (sec.file ? 'pdf' : 'video'),
            url: sec.url || '',
            duree: sec.dureeVideo ? sec.dureeVideo.toString() : '',
            nbpages: sec.nombrePage ? sec.nombrePage.toString() : '',
            selectedFile: null,
            filename: sec.file?.name || '',
            filesize: sec.file?.size || 0,
            hideContent: !(sec.file || sec.url),
            existingFile: sec.file || null
          }));
        }

        this.isLoading = false;
        this.isFormLoaded = true;

        // Forcer la mise à jour de la validation du formulaire
        setTimeout(() => {
          if (this.addchapitreForm) {
            this.addchapitreForm.control.markAsTouched();
            this.addchapitreForm.control.updateValueAndValidity();
          }
        }, 100);
      },
      error: (err) => {
        console.error('Erreur lors du chargement du chapitre:', err);
        this.isLoading = false;
        this.isFormLoaded = true;
        this.error = 'Impossible de charger le chapitre';
      }
    });
    console.log("ba3ed"+this.chapter.title)
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
    this.sections[index].existingFile = null;

    const pdfFileInput = document.getElementById(`pdf-file-${index}`) as HTMLInputElement;
    const imageFileInput = document.getElementById(`image-file-${index}`) as HTMLInputElement;
    if (pdfFileInput) pdfFileInput.value = '';
    if (imageFileInput) imageFileInput.value = '';
  }

  getFileIconClass(section: Section): string {
    if (section.existingFile) {
      const ext = section.existingFile.name?.split('.').pop()?.toLowerCase();
      if (section.existingFile.contentType?.startsWith('image/')) {
        return 'fas fa-file-image text-info';
      }
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

    if (!section.selectedFile) return '';
    const ext = section.selectedFile.name.split('.').pop()?.toLowerCase();

    if (section.selectedFile.type.startsWith('image/')) {
      return 'fas fa-file-image text-info';
    }

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

  isFormValid(): boolean {
    if (!this.isFormLoaded) return false;

    // Validation de base du formulaire
    if (!this.title || !this.coursId) return false;

    // Validation des sections
    for (const section of this.sections) {
      if (!section.title) return false;

      if (!section.hideContent) {
        // Validation selon le type de contenu
        if (section.type === 'video' && !section.url) return false;
        if (section.type === 'pdf' && !section.existingFile && !section.selectedFile) return false;
        if (section.type === 'both' && (!section.url || (!section.existingFile && !section.selectedFile))) return false;
      }
    }

    return true;
  }

  onSubmit() {
    if (!this.isFormValid()) {
      this.error = "Veuillez remplir tous les champs obligatoires correctement";
      return;
    }

    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('courseId', this.coursId);
    formData.append('description', this.description);

    // Prepare sections metadata
    const sectionsData = this.sections.map(section => ({
      title: section.title,
      description: section.description,
      type: section.type,
      url: section.url,
      dureeVideo: section.duree ? parseInt(section.duree) : 0,
      nombrePage: section.nbpages ? parseInt(section.nbpages) : 0
    }));
    formData.append('sections', JSON.stringify(sectionsData));

    // Attach new files
    this.sections.forEach(section => {
      if (section.selectedFile) {
        formData.append('files', section.selectedFile);
      }
    });

    this.isLoading = true;
    this.error = null;

    if (this.isEditMode) {
      this.chapitreService.update(this.chapitreId, formData).subscribe({
        next: (response) => {
          this.isLoading = false;
          alert("Le chapitre a été mis à jour avec succès !");
          this.router.navigate(['/admin/chapters']);
        },
        error: (err) => {
          this.handleError(err);
        }
      });
    } else {
      this.chapitreService.add(formData).subscribe({
        next: (response) => {
          this.isLoading = false;
          alert("Le chapitre a été ajouté avec succès !");
          this.router.navigate(['/admin/chapters']);
        },
        error: (err) => {
          this.handleError(err);
        }
      });
    }
  }

  private handleError(err: any) {
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

  goBackOrFallback() {
    if (window.history.length > 1) this.location.back();
    else this.router.navigate(['/admin/chapters']);
  }
}

interface Section {
  title: string;
  description: string;
  type: string;
  url: string;
  duree: string;
  nbpages: string;
  selectedFile: File | null;
  filename: string;
  filesize: number;
  hideContent: boolean;
  existingFile: any;
}
