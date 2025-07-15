import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {SignupComponent} from './signup/signup.component';
import {LandingpageComponent} from './landingpage/landingpage.component';
import {HomeComponent} from './home/home.component';
import {authGuard} from './services/auth.guard';
import {ForgetpasswordComponent} from './forgetpassword/forgetpassword.component';

const routes: Routes = [
  {path:'login',component:LoginComponent},
  {path:'forgotpassword',component:ForgetpasswordComponent},
  {path:'signup',component:SignupComponent},
  {path:'',component:LandingpageComponent},
  {path:'home',canActivate: [authGuard],component:HomeComponent},
  { path: 'admin',
    canActivate: [authGuard],
    data: { role: 'admin' },
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
