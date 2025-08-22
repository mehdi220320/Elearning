import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import {UsersComponent} from './users/users.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {CoursComponent} from './cours/cours.component';
import {AddCourComponent} from './cours/add-cour/add-cour.component';
import {InstructorsComponent} from './instructors/instructors.component';
import {AddInstructorComponent} from './instructors/add-instructor/add-instructor.component';
import {AddChapitreComponent} from './chapitres/add-chapitre/add-chapitre.component';
import {ChapitresComponent} from './chapitres/chapitres.component';
import {RessourcesListComponent} from './chapitres/ressources-list/ressources-list.component';
import {MediaListComponent} from './chapitres/media-list/media-list.component';
import {AddTestComponent} from './chapitres/add-test/add-test.component';
import {TestListComponent} from './chapitres/test-list/test-list.component';
import {AddHackathonsComponent} from './hackathons/add-hackathons/add-hackathons.component';
import {HackathonsComponent} from './hackathons/hackathons.component';

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
      { path: 'addChapitre', component: AddChapitreComponent },
      { path: 'chapters', component: ChapitresComponent },
      { path: 'ressources', component: RessourcesListComponent },
      { path: 'medias', component: MediaListComponent },
      { path: 'addTest',component:AddTestComponent},
      { path: 'tests',component:TestListComponent},
      { path: 'addhackathon',component:AddHackathonsComponent},
      { path: 'hackathons',component:HackathonsComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
