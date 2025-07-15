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
import {authInterceptor} from './services/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    LandingpageComponent,
    HomeComponent,
    ForgetpasswordComponent
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
