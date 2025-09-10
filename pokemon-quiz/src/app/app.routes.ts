import { Routes } from '@angular/router';
import {QuizzComponent} from './quizz/quizz.component';
import {ResultComponent} from './result/result.component';

export const routes: Routes = [
  {
    path: '',
    component: QuizzComponent
  },
  {
    path: 'quizz-result',
    component: ResultComponent
  }
];
