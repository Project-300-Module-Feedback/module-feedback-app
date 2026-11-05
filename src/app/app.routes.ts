import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { AddfeedbackComponent } from './addfeedback/addfeedback';
import { ListfeedbackComponent } from './listfeedback/listfeedback';
import { StudentDetailsComponent } from './student-details/student-details';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'student', component: StudentDetailsComponent },
  { path: 'student/feedback', component: AddfeedbackComponent },
  { path: 'admin', component: ListfeedbackComponent }
];


