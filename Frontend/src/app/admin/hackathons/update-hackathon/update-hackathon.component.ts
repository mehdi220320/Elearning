import { Component } from '@angular/core';
import {Course} from '../../../models/Course';
import {Category} from '../../../models/Category';
import {CourseService} from '../../../services/course.service';
import {CategoryService} from '../../../services/category.service';
import {HackathonService} from '../../../services/hackathon.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-update-hackathon',
  standalone: false,
  templateUrl: './update-hackathon.component.html',
  styleUrl: './update-hackathon.component.css'
})
export class UpdateHackathonComponent {
  hackathonId!: string;

  courses: Course[] = [];
  categories: Category[] = [];
  categoryid = '';
  fee = 0;
  title = '';
  Prizes = '';
  description = '';
  shortDescription = '';
  coursesSelected: string[] = [];
  startDate!: any;
  endDate!: any;
  location = '';
  maxParticipants = 0;

  objectifs: string[] = [];
  objectif = '';

  competences: string[] = [];
  skill = '';

  rules: string[] = [];
  rule = '';

  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  fileName = '';
  fileSize = '';
  errorMessage = '';
  error: string | null = null;

  isLoading = false;

  constructor(
    private courseService: CourseService,
    private categoryService: CategoryService,
    private hackathonService: HackathonService,
    private router: Router,
    private route: ActivatedRoute,
    private loc: Location
  ) {}

  ngOnInit(): void {
    this.hackathonId = this.route.snapshot.paramMap.get('id')!;
    this.loadCategories();
    this.loadHackathonData();
  }

  loadCategories() {
    this.categoryService.getAll().subscribe({
      next: (response) => {
        this.categories = response;
      },
      error: (err) => console.error(err)
    });
  }

  loadCourses() {
    if (!this.categoryid) return;
    this.courseService.getCoursesByCategorie(this.categoryid).subscribe({
      next: (response) => {
        this.courses = response;
      },
      error: (err) => console.error(err)
    });
  }

  loadHackathonData() {
    this.hackathonService.getById(this.hackathonId).subscribe({
      next: (hack) => {
        this.title = hack.title;
        this.Prizes = hack.Prizes;
        this.description = hack.description;
        this.shortDescription = hack.shortDescription;
        this.fee = hack.fee;
        this.location = hack.location;
        this.maxParticipants = hack.maxParticipants;
        this.startDate = new Date(hack.startDate).toISOString().substring(0, 16);
        this.endDate = new Date(hack.endDate).toISOString().substring(0, 16);
        this.categoryid = hack.theme?._id || '';
        this.objectifs = hack.objectifs || [];
        this.rules = hack.rules || [];
        this.competences = hack.skills || [];
        this.coursesSelected = hack.courses.map(c => c._id);
        this.loadCourses(); // charge les cours du thème
        if (hack.coverImage?.path) {
          this.imagePreview = hack.coverImage.path;
        }
      },
      error: (err) => console.error(err)
    });
  }

  isSelected(courseId: string): boolean {
    return this.coursesSelected.includes(courseId);
  }

  toggleCourseSelection(courseId: string, isChecked: boolean) {
    if (isChecked) {
      if (!this.coursesSelected.includes(courseId)) this.coursesSelected.push(courseId);
    } else {
      this.coursesSelected = this.coursesSelected.filter(id => id !== courseId);
    }
  }

  goBackOrFallback() {
    if (window.history.length > 1) this.loc.back();
    else this.router.navigate(['/admin/hackathons']);
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    if (!file.type.match(/image\/(jpeg|png|jpg)/)) {
      this.errorMessage = 'Only JPG/PNG images are allowed';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.errorMessage = 'Image must be less than 5MB';
      return;
    }

    this.selectedFile = file;
    this.fileName = file.name;
    this.fileSize = this.formatFileSize(file.size);
    this.errorMessage = '';

    const reader = new FileReader();
    reader.onload = () => (this.imagePreview = reader.result);
    reader.readAsDataURL(file);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  removeFile() {
    this.imagePreview = null;
    this.selectedFile = null;
    this.fileName = '';
    this.fileSize = '';
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      this.error = "Veuillez remplir tous les champs obligatoires correctement";
      return;
    }

    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('location', this.location);
    formData.append('startDate', this.startDate);
    formData.append('endDate', this.endDate);
    formData.append('shortDescription', this.shortDescription);
    formData.append('description', this.description);
    formData.append('theme', this.categoryid);
    formData.append('fee', this.fee.toString());
    formData.append('Prizes', this.Prizes);
    formData.append('maxParticipants', this.maxParticipants.toString());

    this.coursesSelected.forEach((course, i) => formData.append(`courses[${i}]`, course));
    this.objectifs.forEach((obj, i) => formData.append(`objectifs[${i}]`, obj));
    this.rules.forEach((rule, i) => formData.append(`rules[${i}]`, rule));
    this.competences.forEach((skill, i) => formData.append(`skills[${i}]`, skill));
    if (this.selectedFile) formData.append('coverImageFile', this.selectedFile);

    this.hackathonService.updateHackathon(this.hackathonId, formData).subscribe({
      next: (res) => {
        alert('Le hackathon a été mis à jour avec succès !');
        this.router.navigate(['/admin/hackathons']);
      },
      error: (err) => console.error(err)
    });
  }

  addobjectif() {
    if (this.objectif && this.objectif.trim() !== '') {
      this.objectifs.push(this.objectif);
      this.objectif = '';
    }
  }

  removeobjectif(obj: string) {
    this.objectifs = this.objectifs.filter(o => o !== obj);
  }

  addSkill() {
    if (this.skill && this.skill.trim() !== '') {
      this.competences.push(this.skill);
      this.skill = '';
    }
  }

  removeSkill(skill: string) {
    this.competences = this.competences.filter(s => s !== skill);
  }

  addrule() {
    if (this.rule && this.rule.trim() !== '') {
      this.rules.push(this.rule);
      this.rule = '';
    }
  }

  removerule(rule: string) {
    this.rules = this.rules.filter(r => r !== rule);
  }
}
