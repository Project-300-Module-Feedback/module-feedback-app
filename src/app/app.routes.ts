import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { AddfeedbackComponent } from './addfeedback/addfeedback';
import { ListfeedbackComponent } from './listfeedback/listfeedback';
import { StudentDetailsComponent } from './student-details/student-details';
import { NotFoundComponent } from './not-found/not-found';
import { ThanksComponent } from './thanks/thanks';
import { ModulereviewsComponent } from './modulereviews/modulereviews';

export const routes: Routes = [
  { path: '', redirectTo: 'modules', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'modules',
    loadComponent: () => import('./modules/modules-list').then(module => module.ModulesListComponent)
  },
  {
    path: 'modules/:id',
    loadComponent: () => import('./modules/module-detail').then(module => module.ModuleDetailComponent)
  },
  { path: 'student', component: StudentDetailsComponent },
  { path: 'student/feedback', component: AddfeedbackComponent },
  { path: 'admin', component: ListfeedbackComponent },
  { path: 'student/thanks', component: ThanksComponent },
  { path: 'lecturer', component: ModulereviewsComponent },

  // keep this one last, it catches any page that doesn't exist
  { path: '**', component: NotFoundComponent }
];