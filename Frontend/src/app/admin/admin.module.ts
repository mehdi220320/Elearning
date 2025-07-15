import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import {FormsModule} from '@angular/forms';
import { CoursComponent } from './cours/cours.component';
import { AddCourComponent } from './cours/add-cour/add-cour.component';


@NgModule({
  declarations: [
    AdminComponent,
    DashboardComponent,
    UsersComponent,
    CoursComponent,
    AddCourComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule
  ]

})
export class AdminModule { }
