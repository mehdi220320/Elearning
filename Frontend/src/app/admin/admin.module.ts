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
import { ChapitresComponent } from './chapitres/chapitres.component';
import { AddChapitreComponent } from './chapitres/add-chapitre/add-chapitre.component';
import { RessourcesListComponent } from './chapitres/ressources-list/ressources-list.component';
import { MediaListComponent } from './chapitres/media-list/media-list.component';

@NgModule({
  declarations: [
    AdminComponent,
    DashboardComponent,
    UsersComponent,
    CoursComponent,
    AddCourComponent,
    InstructorsComponent,
    AddInstructorComponent,
    ChapitresComponent,
    AddChapitreComponent,
    RessourcesListComponent,
    MediaListComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule
  ]

})
export class AdminModule { }
