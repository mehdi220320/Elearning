import { Component } from '@angular/core';
import {TestService, Question, Test, Option} from '../../services/test.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {AuthService} from '../../services/authServices/auth.service';

@Component({
  selector: 'app-test-details',
  standalone: false,
  templateUrl: './test-details.component.html',
  styleUrl: './test-details.component.css'
})
export class TestDetailsComponent {
  test: Test ={
    _id: '',
    title: '',
    description: '',
    chapter: '',
    course: '',
    questions: [{
      _id:'',
      questionText: '',
      options: [{
        text:  '',
        isCorrect: false,
      }],
      points: 0,
    }],
    passingScore: 0,
    timeLimit: 0,
    isPublished: false,
  }
  currentQuestionIndex = 0;
  userResponses: { [key: string]: number } = {};
  isLoading = false;
  testCompleted = false;
  score: number =0;
  timeRemaining: number = 0;
  timer: any;

  constructor(
    private testService: TestService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private authService:AuthService
  ) {}

  ngOnInit(): void {
    this.loadTest();
  }

  loadTest(): void {
    const testId = this.route.snapshot.paramMap.get('id');
    console.log("aw id :"+ testId)
    if (testId) {
      this.isLoading = true;
      this.testService.getTestById(testId).subscribe({
        next: (ApiResponse) => {
          this.test = ApiResponse.data.test;
          console.log('aw test : '+this.test)
          if (this.test.timeLimit) {
            this.timeRemaining = this.test.timeLimit * 60;
            this.startTimer();
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to load test', err);
          this.isLoading = false;
        }
      });
    }
  }
  selectAnswer(optionIndex: number): void {
    const currentQuestionId = this.test.questions[this.currentQuestionIndex]._id;
    this.userResponses[currentQuestionId] = optionIndex;
  }

  isSelected(optionIndex: number): boolean {
    const currentQuestionId = this.test.questions[this.currentQuestionIndex]._id;
    return this.userResponses[currentQuestionId] === optionIndex;
  }

  startTimer(): void {
    this.timer = setInterval(() => {
      if (this.timeRemaining > 0) {
        this.timeRemaining--;
      } else {
        clearInterval(this.timer);
        this.submitTest();
      }
    }, 1000);
  }
  passed:boolean=false;
  correctAnswers:number=0
  submitTest(): void {
    if (!this.test || this.testCompleted) return;

    clearInterval(this.timer);
    this.isLoading = true;

    const responses = Object.keys(this.userResponses).map(questionId => ({
      questionId,
      selectedOption: this.userResponses[questionId]
    }));

    this.testService.submitTest(this.test._id, this.authService.getUserId() ,responses).subscribe({
      next: (result) => {
        console.log(result.data.result)
        this.score = result.data.result.score;
        this.passed=result.data.result.passed;
        this.correctAnswers=result.data.result.correctAnswers
        this.testCompleted = true;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to submit test', err);
        this.isLoading = false;
      }
    });
  }
  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  previous() {
    if(this.currentQuestionIndex>0)
      this.currentQuestionIndex-=1
  }
  next(){
    if(this.currentQuestionIndex<this.test!.questions.length)
      this.currentQuestionIndex+=1
  }
  goBackOrFallback() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/admin/chapters']);
    }
  }
  reload(){
    window.location.reload();
  }
}
