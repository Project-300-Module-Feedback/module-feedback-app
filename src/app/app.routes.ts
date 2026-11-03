import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { AddfeedbackComponent } from './addfeedback/addfeedback';
import { ListfeedbackComponent } from './listfeedback/listfeedback';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'student', component: AddfeedbackComponent },
  { path: 'admin', component: ListfeedbackComponent }
];


