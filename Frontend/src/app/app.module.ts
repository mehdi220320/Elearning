import {LOCALE_ID, NgModule} from '@angular/core';
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
import { TestDetailsComponent } from './chapters/test-details/test-details.component';
import { HackthonsComponent } from './hackthons/hackthons.component';
import { HackathonDetailsComponent } from './hackthons/hackathon-details/hackathon-details.component';
import { FirstLettersPipe } from './pipes/first-letters.pipe';
// 👇 Import Angular locale API
import { registerLocaleData } from '@angular/common';
// 👇 Import la locale française
import localeFr from '@angular/common/locales/fr';

// 👇 Enregistre la locale française AVANT de bootstrap l'app
registerLocaleData(localeFr);
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
        TestDetailsComponent,
        HackthonsComponent,
        HackathonDetailsComponent,
        FirstLettersPipe
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
        },
        {
          provide: LOCALE_ID,
          useValue: 'fr'
        }
    ],
    exports: [
        TruncatePipe
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
