import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {SignupComponent} from './signup/signup.component';
import {LandingpageComponent} from './landingpage/landingpage.component';
import {HomeComponent} from './home/home.component';
import {authGuard} from './services/authServices/auth.guard';
import {ForgetpasswordComponent} from './forgetpassword/forgetpassword.component';
import {NavbarComponent} from './navbar/navbar.component';
import {noAuthGuard} from './services/authServices/no-auth.guard';
import {CoursesComponent} from './courses/courses.component';
import {InstructorsComponent} from './instructors/instructors.component';
import {InstructorDetailsComponent} from './instructors/instructor-details/instructor-details.component';
import {CourseDetailsComponent} from './courses/course-details/course-details.component';
import {ChaptersComponent} from './chapters/chapters.component';
import {TestDetailsComponent} from './chapters/test-details/test-details.component';
import {HackthonsComponent} from './hackthons/hackthons.component';
import {HackathonDetailsComponent} from './hackthons/hackathon-details/hackathon-details.component';
import {AddreclamationComponent} from './reclamation/addreclamation/addreclamation.component';
import {EditUserComponent} from './edit-user/edit-user.component';

const routes: Routes = [
  {
    path: '',
    component: LandingpageComponent,
    canActivate: [noAuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [noAuthGuard]
  },
  {
    path: 'forgotpassword',
    component: ForgetpasswordComponent,
    canActivate: [noAuthGuard]
  },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [noAuthGuard]
  },

  {
    path: '',
    component: NavbarComponent,
    canActivate: [authGuard],
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'hackathons', component: HackthonsComponent },
      { path: 'hackathons/:id', component: HackathonDetailsComponent },
      { path: 'courses', component: CoursesComponent },
      { path: 'courses/:id', component: CourseDetailsComponent },
      { path: 'courses/:id/chapters', component: ChaptersComponent },
      { path: 'courses/:courseid/chapters/:chapterid/test/:id', component: TestDetailsComponent },
      { path: 'instructors', component: InstructorsComponent },
      { path: 'instructors/:id', component: InstructorDetailsComponent },
      { path: 'addReclamation', component: AddreclamationComponent },
      { path: 'parametre', component: EditUserComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },

  {
    path: 'admin',
    canActivate: [authGuard],
    data: { role: 'admin' },
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },

  { path: '**', redirectTo: '' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
