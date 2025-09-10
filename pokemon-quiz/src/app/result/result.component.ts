import {Component, Input} from '@angular/core';
import {DatePipe, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';

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
export class ResultComponent {

  today: Date = new Date();
  score: number = 7;

  username: string = '';
  saved: boolean = false;

  saveScore() {
    // Tu peux appeler un service ici pour sauvegarder le score dans une base
    console.log('Score enregistré:', {
      username: this.username,
      score: this.score
    });

    this.saved = true;
  }
}
