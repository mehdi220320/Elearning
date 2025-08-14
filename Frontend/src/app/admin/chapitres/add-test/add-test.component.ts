import {Component, OnInit} from '@angular/core';
import {Course} from '../../../models/Course';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Chapitre} from '../../../models/Chapitres';
import {TestService} from '../../../services/test.service';
import {Router} from '@angular/router';
import {CourseService} from '../../../services/course.service';
import {ChapitreService} from '../../../services/chapitre.service';
import {AuthService} from '../../../services/authServices/auth.service';

@Component({
  selector: 'app-add-test',
  standalone: false,
  templateUrl: './add-test.component.html',
  styleUrl: './add-test.component.css'
})
export class AddTestComponent implements OnInit {
  testForm: FormGroup;
  courses: Course[] = [];
  chapters: Chapitre[] = [];
  isLoading = false;
  questionsList: any[] = []; // Remplace le FormArray

  constructor(
    private fb: FormBuilder,
    private authService:AuthService,
    private testService: TestService,
    private courseService: CourseService,
    private chapterService: ChapitreService,
    private router: Router,
  ) {
    this.testForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(500)],
      course: ['', Validators.required],
      chapter: ['', Validators.required],
      passingScore: [70, [Validators.required, Validators.min(0), Validators.max(100)]],
      timeLimit: [null, Validators.min(1)],
      questionsToShow: [10, [Validators.required, Validators.min(1)]]
    });
  }

  showMessage(message: string, type: 'success'|'error'|'warning') {
    console.log(`${type}: ${message}`);
    alert(`${type}: ${message}`);
  }

  ngOnInit(): void {
    this.loadCourses();
    this.addQuestion(); // Ajoute une question par défaut
  }

  loadCourses(): void {
    this.courseService.getAll().subscribe({
      next: (courses) => {
        this.courses = courses;
      },
      error: (err) => {
        console.error('Échec du chargement des cours', err);
        this.showMessage('Erreur lors du chargement des cours', 'error');
      }
    });
  }

  onCourseChange(): void {
    const courseId = this.testForm.get('course')?.value;
    if (courseId) {
      this.chapterService.getChaptersByCourse(courseId).subscribe({
        next: (chapters) => {
          this.chapters = chapters;
          this.testForm.get('chapter')?.reset();
        },
        error: (err) => {
          console.error('Échec du chargement des chapitres', err);
          this.showMessage('Erreur lors du chargement des chapitres', 'error');
        }
      });
    }
  }

  addQuestion(): void {
    this.questionsList.push({
      questionText: '',
      points: 1,
      options: [
        { text: '', isCorrect: true },
        { text: '', isCorrect: false }
      ]
    });
  }

  addOption(questionIndex: number): void {
    this.questionsList[questionIndex].options.push({
      text: '',
      isCorrect: false
    });
  }

  removeOption(questionIndex: number, optionIndex: number): void {
    if (this.questionsList[questionIndex].options.length > 2) {
      this.questionsList[questionIndex].options.splice(optionIndex, 1);
    } else {
      this.showMessage('Une question doit avoir au moins 2 options', 'warning');
    }
  }

  setCorrectAnswer(questionIndex: number, optionIndex: number): void {
    this.questionsList[questionIndex].options.forEach((option: any, index: number) => {
      option.isCorrect = (index === optionIndex);
    });
  }

  removeQuestion(index: number): void {
    if (this.questionsList.length > 1) {
      this.questionsList.splice(index, 1);
    } else {
      this.showMessage('Vous devez avoir au moins une question', 'warning');
    }
  }

  onSubmit(): void {
    // Validation manuelle
    if (this.testForm.invalid) {
      this.testForm.markAllAsTouched();
      this.showMessage('Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }

    // Validation des questions
    for (const question of this.questionsList) {
      if (!question.questionText || question.points < 1) {
        this.showMessage('Veuillez vérifier toutes les questions', 'error');
        return;
      }

      const validOptions = question.options.filter((opt: any) => opt.text.trim() !== '');
      if (validOptions.length < 2 || !question.options.some((opt: any) => opt.isCorrect)) {
        this.showMessage('Chaque question doit avoir au moins 2 options valides avec une réponse correcte', 'error');
        return;
      }
    }

    this.isLoading = true;
    const formValue = this.testForm.value;

    const testData = {
      ...formValue,
      questions: this.questionsList,
      createdBy: this.authService.getUserId()
    };
    console.log(testData)
    this.testService.createTest(testData).subscribe({
      next: (createdTest) => {
        this.isLoading = false;
        this.showMessage('Test créé avec succès', 'success');
        this.router.navigate(['/admin/tests']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Échec de la création du test', err);
        this.showMessage('Erreur lors de la création du test', 'error');
      }
    });
  }

  onCancel(): void {
    if (this.testForm.dirty || this.questionsList.some(q => q.questionText || q.options.some((o: any) => o.text))) {
      if (confirm('Voulez-vous vraiment annuler? Les modifications ne seront pas enregistrées.')) {
        this.router.navigate(['/tests/manage']);
      }
    } else {
      this.router.navigate(['/tests/manage']);
    }
  }
}
