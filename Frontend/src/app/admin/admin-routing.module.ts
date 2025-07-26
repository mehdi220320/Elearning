import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import {UsersComponent} from './users/users.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {CoursComponent} from './cours/cours.component';
import {AddCourComponent} from './cours/add-cour/add-cour.component';
import {InstructorsComponent} from './instructors/instructors.component';
import {AddInstructorComponent} from './instructors/add-instructor/add-instructor.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: UsersComponent },
      { path: 'courses', component: CoursComponent },
      { path: 'addCourse', component: AddCourComponent },
      { path: 'instructors', component: InstructorsComponent },
      { path: 'addinstructor', component: AddInstructorComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
