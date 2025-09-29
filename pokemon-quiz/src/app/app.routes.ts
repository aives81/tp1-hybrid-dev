import {Routes} from '@angular/router';
import {QuizzComponent} from './quizz/quizz.component';
import {ResultComponent} from './result/result.component';
import {HomeComponent} from './home/home.component';
import {LeaderboardComponent} from './leaderboard/leaderboard.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'quizz',
    component: QuizzComponent
  },
  {
    path: 'quizz-result',
    component: ResultComponent
  },
  {
    path: 'leaderboard',
    component: LeaderboardComponent
  }
];
