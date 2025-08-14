import { Injectable } from '@angular/core';
import {catchError, Observable, throwError} from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import {environment} from '../models/environment';

export  interface Test {
  _id: string;
  title: string;
  description?: string;
  chapter: string;
  course: string;
  questions: Question[];
  passingScore?: number;
  timeLimit?: number;
  isPublished?: boolean;
}

export interface Question {
  _id:string;
  questionText: string;
  options: Option[];
  points?: number;
}

export interface Option {
  text: string;
  isCorrect: boolean;
}

export interface TestResult {
  user: string;
  score: number;
  responses: UserResponse[];
  completedAt: Date;
}

export interface UserResponse {
  questionId: string;
  selectedOption: number;
  isCorrect: boolean;
}

export interface TestSubmission {
  testId: string;
  responses: {
    questionId: string;
    selectedOption: number;
  }[];
  attachment?: File;
}
interface ApiResponse {
  status: string;
  results: number;
  data: {
    tests: Test[];
  };
}
interface ApiResponse2 {
  status: string;
  results: number;
  data: {
    test: Test;
  };
}
@Injectable({
  providedIn: 'root'
})
export class TestService {
  private apiUrl = `${environment.apiUrl}tests`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  private getFormDataHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
      // Note: Don't set Content-Type for FormData - browser will set it automatically with boundary
    });
  }

  // Create a new test
  createTest(testData: Omit<Test, 'id'>): Observable<Test> {
    return this.http.post<Test>(`${this.apiUrl}/create`, testData, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Get all tests (with optional filtering)
  getAllTests(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.apiUrl+'/all');
  }
  getAllTestsByChapter(id:any): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.apiUrl+'/chapter/'+id);
  }

  getTestById(testId: string): Observable<ApiResponse2> {
    return this.http.get<any>(`${this.apiUrl}/${testId}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Update a test
  updateTest(testId: string, updateData: Partial<Test>): Observable<Test> {
    return this.http.patch<Test>(`${this.apiUrl}/update/${testId}`, updateData, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Delete a test
  deleteTest(testId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${testId}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Submit test answers
  submitTest(testId: string,userid:any, responses: { questionId: string; selectedOption: number }[], attachment?: File): Observable<any> {
    const formData = new FormData();
    formData.append('responses', JSON.stringify(responses));
    formData.append('userid',userid)
    if (attachment) {
      formData.append('attachment', attachment);
    }

    return this.http.post<any>(`${this.apiUrl}/submit/${testId}`, formData, {
      headers: this.getFormDataHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Get user's test results
  getUserResults(testId: string): Observable<TestResult[]> {
    return this.http.get<TestResult[]>(`${this.apiUrl}/results/${testId}`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Error handling
  private handleError(error: any): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.status) {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;

      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else if (error.statusText) {
        errorMessage = error.statusText;
      }
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
