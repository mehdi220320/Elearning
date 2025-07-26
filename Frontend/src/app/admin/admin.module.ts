import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import {FormsModule} from '@angular/forms';
import { CoursComponent } from './cours/cours.component';
import { AddCourComponent } from './cours/add-cour/add-cour.component';
import { InstructorsComponent } from './instructors/instructors.component';
import { AddInstructorComponent } from './instructors/add-instructor/add-instructor.component';

@NgModule({
  declarations: [
    AdminComponent,
    DashboardComponent,
    UsersComponent,
    CoursComponent,
    AddCourComponent,
    InstructorsComponent,
    AddInstructorComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule
  ]

})
export class AdminModule { }
