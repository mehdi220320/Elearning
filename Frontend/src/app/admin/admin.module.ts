import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CoursComponent } from './cours/cours.component';
import { AddCourComponent } from './cours/add-cour/add-cour.component';
import { InstructorsComponent } from './instructors/instructors.component';
import { AddInstructorComponent } from './instructors/add-instructor/add-instructor.component';
import { ChapitresComponent } from './chapitres/chapitres.component';
import { AddChapitreComponent } from './chapitres/add-chapitre/add-chapitre.component';
import { RessourcesListComponent } from './chapitres/ressources-list/ressources-list.component';
import { MediaListComponent } from './chapitres/media-list/media-list.component';
import { AddTestComponent } from './chapitres/add-test/add-test.component';
import {ToastrModule} from 'ngx-toastr';
import { TestListComponent } from './chapitres/test-list/test-list.component';
import { HackathonsComponent } from './hackathons/hackathons.component';
import { AddHackathonsComponent } from './hackathons/add-hackathons/add-hackathons.component';
import { TruncatePipe } from './pipes/truncate.pipe';
import { ReclamationsComponent } from './reclamations/reclamations.component';
import { ReclamationDetailsComponent } from './reclamations/reclamation-details/reclamation-details.component';
import { UpdateCourseComponent } from './cours/update-course/update-course.component';
import { UpdateChapterComponent } from './chapitres/update-chapter/update-chapter.component';
import { UpdateInstructorComponent } from './instructors/update-instructor/update-instructor.component';
import { UpdateHackathonComponent } from './hackathons/update-hackathon/update-hackathon.component';
import { UpdateTestComponent } from './chapitres/update-test/update-test.component';
import { AdminsComponent } from './admins/admins.component';
import { CreateAdminComponent } from './admins/create-admin/create-admin.component';

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
    AddTestComponent,
    TestListComponent,
    HackathonsComponent,
    AddHackathonsComponent,
    TruncatePipe,
    ReclamationsComponent,
    ReclamationDetailsComponent,
    UpdateCourseComponent,
    UpdateChapterComponent,
    UpdateInstructorComponent,
    UpdateHackathonComponent,
    UpdateTestComponent,
    AdminsComponent,
    CreateAdminComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ToastrModule.forRoot(),
    ReactiveFormsModule
  ]

})
export class AdminModule { }
