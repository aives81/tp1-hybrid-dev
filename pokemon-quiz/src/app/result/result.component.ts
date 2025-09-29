import {Component, Input, OnInit} from '@angular/core';
import {DatePipe, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {StorageService} from '../services/storage.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-result',
  imports: [
    DatePipe,
    FormsModule,
    NgIf
  ],
  templateUrl: './result.component.html',
  styleUrl: './result.component.scss'
})
export class ResultComponent implements OnInit {

  today: Date = new Date();
  score: number = 0;

  username: string = '';
  saved: boolean = false;

  constructor(private storageService: StorageService,
              private router: Router) {}

  ngOnInit() {
    const storedScore = localStorage.getItem('quizScore');
    this.score = storedScore ? +storedScore : 0;
  }

  saveScore() {
    const player = {
      name: this.username,
      score: this.score,
      date: new Date().toISOString()
    };

    this.storageService.readScores().then(scores => {
      scores.push(player);
      // On garde trié par score (ou temps si égalité)
      scores.sort((a, b) => b.score - a.score);
      this.storageService.saveScore(scores);
    }).catch(error => {
      this.storageService.saveDataInLocalStorage(player);
    });

    this.saved = true;
    localStorage.removeItem('quizScore');

    setTimeout(() => {
      this.router.navigate(['/']);
    }, 1000);
  }
}
