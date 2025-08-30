import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Course} from '../../../models/Course';
import {Chapitre} from '../../../models/Chapitres';
import {AuthService} from '../../../services/authServices/auth.service';
import {Question, TestService} from '../../../services/test.service';
import {CourseService} from '../../../services/course.service';
import {ChapitreService} from '../../../services/chapitre.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-update-test',
  standalone: false,
  templateUrl: './update-test.component.html',
  styleUrl: './update-test.component.css'
})
export class UpdateTestComponent implements OnInit {
  testForm: FormGroup;
  courses: Course[] = [];
  chapters: Chapitre[] = [];
  isLoading = false;
  questionsList: Question[] = [];
  testId: string = '';
  currentCourse: Course | null = null;
  currentChapter: Chapitre | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private testService: TestService,
    private authService: AuthService,
    private courseService: CourseService,
    private chapterService: ChapitreService
  ) {
    this.testForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(500)],
      course: [{ value: '', disabled: true }, Validators.required],
      chapter: [{ value: '', disabled: true }, Validators.required],
      passingScore: [70, [Validators.required, Validators.min(0), Validators.max(100)]],
      timeLimit: [null, Validators.min(1)],
      questionsToShow: [10, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.testId = this.route.snapshot.paramMap.get('id') || '';
    this.loadCourses();
    if (this.testId) {
      this.loadTest();
    }
  }

  loadCourses(): void {
    this.courseService.getAll().subscribe({
      next: (courses) => this.courses = courses,
      error: (err) => console.error('Erreur lors du chargement des cours', err)
    });
  }

  loadTest(): void {
    this.isLoading = true;
    this.testService.getTestById(this.testId).subscribe({
      next: (res) => {
        const test = res.data.test;
        console.log("Test chargé : ", test);

        // Load the course and chapter details
        this.loadCourseAndChapterDetails(test.course, test.chapter).then(() => {
          this.testForm.patchValue({
            title: test.title,
            description: test.description,
            course: test.course,
            chapter: test.chapter,
            passingScore: test.passingScore,
            timeLimit: test.timeLimit,
            questionsToShow: test.questions.length
          });

          this.questionsList = test.questions.map(q => ({
            ...q
          }));

          this.isLoading = false;
        });
      },
      error: (err) => {
        console.error('Erreur lors du chargement du test', err);
        this.isLoading = false;
      }
    });
  }

  async loadCourseAndChapterDetails(courseId: string, chapterId: string): Promise<void> {
    try {
      // Load course details
      const course = await this.courseService.getById(courseId).toPromise();
      if(course!==undefined) {
        this.currentCourse = course;
      }
      // Load chapter details
      const chapter = await this.chapterService.getChapterById(chapterId).toPromise();
      if(chapter!==undefined) {
        this.currentChapter = chapter;
      }

      // Load chapters for the course to populate the dropdown (even though it's disabled)
      this.chapterService.getChaptersByCourse(courseId).subscribe({
        next: (chapters) => {
          this.chapters = chapters;
        },
        error: (err) => console.error('Erreur lors du chargement des chapitres', err)
      });
    } catch (error) {
      console.error('Erreur lors du chargement des détails du cours/chapitre', error);
    }
  }

  getCourseTitle(courseId: string): string {
    if (this.currentCourse && this.currentCourse._id === courseId) {
      return this.currentCourse.title;
    }
    const course = this.courses.find(c => c._id === courseId);
    return course ? course.title : 'Chargement...';
  }

  getChapterTitle(chapterId: string): string {
    if (this.currentChapter && this.currentChapter._id === chapterId) {
      return this.currentChapter.title;
    }
    const chapter = this.chapters.find(c => c._id === chapterId);
    return chapter ? chapter.title : 'Chargement...';
  }

  addQuestion(): void {
    this.questionsList.push({
      _id: '',
      questionText: '',
      points: 1,
      options: [
        { text: '', isCorrect: true },
        { text: '', isCorrect: false }
      ]
    });
  }

  removeQuestion(index: number): void {
    if (this.questionsList.length > 1) {
      this.questionsList.splice(index, 1);
    } else {
      alert('Vous devez avoir au moins une question');
    }
  }

  addOption(questionIndex: number): void {
    this.questionsList[questionIndex].options.push({ text: '', isCorrect: false });
  }

  removeOption(questionIndex: number, optionIndex: number): void {
    if (this.questionsList[questionIndex].options.length > 2) {
      this.questionsList[questionIndex].options.splice(optionIndex, 1);
    } else {
      alert('Une question doit avoir au moins 2 options');
    }
  }

  setCorrectAnswer(questionIndex: number, optionIndex: number): void {
    this.questionsList[questionIndex].options.forEach((opt, idx) => {
      opt.isCorrect = idx === optionIndex;
    });
  }

  onSubmit(): void {
    if (this.testForm.invalid) {
      this.testForm.markAllAsTouched();
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Validation des questions
    for (const question of this.questionsList) {
      if (!question.questionText || (question.points ?? 0) < 1) {
        alert('Veuillez vérifier toutes les questions');
        return;
      }
      const validOptions = question.options.filter(opt => opt.text.trim() !== '');
      if (validOptions.length < 2 || !question.options.some(opt => opt.isCorrect)) {
        alert('Chaque question doit avoir au moins 2 options valides avec une réponse correcte');
        return;
      }
    }

    const formValue = this.testForm.getRawValue(); // Get raw values including disabled fields
    const updateData = {
      ...formValue,
      questions: this.questionsList
    };

    this.isLoading = true;
    this.testService.updateTest(this.testId, updateData).subscribe({
      next: (updatedTest) => {
        this.isLoading = false;
        alert('Test mis à jour avec succès');
        this.router.navigate(['/admin/tests']);
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du test', err);
        this.isLoading = false;
        alert('Erreur lors de la mise à jour du test');
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/tests']);
  }
}
