import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { SignupComponent } from './signup/signup';
import { VerifyComponent } from './verify/verify';
import { AddfeedbackComponent } from './addfeedback/addfeedback';
import { ListfeedbackComponent } from './listfeedback/listfeedback';
import { StudentDetailsComponent } from './student-details/student-details';
import { NotFoundComponent } from './not-found/not-found';
import { ThanksComponent } from './thanks/thanks';
import { ModulereviewsComponent } from './modulereviews/modulereviews';
import { authGuard, roleGuard } from './services/auth.guard';

export const routes: Routes = [
  // first thing anyone sees is the login page
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // anyone can open these
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'verify', component: VerifyComponent },

  // need to be logged in
  {
    path: 'modules',
    canActivate: [authGuard],
    loadComponent: () => import('./modules/modules-list').then(module => module.ModulesListComponent)
  },
  {
    path: 'modules/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./modules/module-detail').then(module => module.ModuleDetailComponent)
  },

  // students only
  { path: 'student', component: StudentDetailsComponent, canActivate: [roleGuard('student')] },
  { path: 'student/feedback', component: AddfeedbackComponent, canActivate: [roleGuard('student')] },
  { path: 'student/feedback/:moduleId', component: AddfeedbackComponent, canActivate: [roleGuard('student')] },
  { path: 'student/thanks', component: ThanksComponent, canActivate: [roleGuard('student')] },

  // lecturers and admins
  { path: 'lecturer', component: ModulereviewsComponent, canActivate: [roleGuard('lecturer', 'admin')] },

  // admins only
  { path: 'admin', component: ListfeedbackComponent, canActivate: [roleGuard('admin')] },

  // keep this one last, it catches any page that doesn't exist
  { path: '**', component: NotFoundComponent }
];