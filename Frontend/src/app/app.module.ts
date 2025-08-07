import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { LandingpageComponent } from './landingpage/landingpage.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component';
import {authInterceptor} from './services/authServices/auth.interceptor';
import { NavbarComponent } from './navbar/navbar.component';
import { CoursesComponent } from './courses/courses.component';
import { InstructorsComponent } from './instructors/instructors.component';
import { InstructorDetailsComponent } from './instructors/instructor-details/instructor-details.component';
import { CourseDetailsComponent } from './courses/course-details/course-details.component';
import { TruncatePipe } from './pipes/truncate.pipe';
import { ChaptersComponent } from './chapters/chapters.component';
import { RatingModalComponent } from './rating-modal/rating-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    LandingpageComponent,
    HomeComponent,
    ForgetpasswordComponent,
    NavbarComponent,
    CoursesComponent,
    InstructorsComponent,
    InstructorDetailsComponent,
    CourseDetailsComponent,
    TruncatePipe,
    ChaptersComponent,
    RatingModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: authInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
