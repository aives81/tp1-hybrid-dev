import {Component, OnInit} from '@angular/core';
import {StorageService} from '../services/storage.service';

@Component({
  selector: 'app-leaderboard',
  imports: [],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.scss'
})
export class LeaderboardComponent implements OnInit {

  topPlayers: any[] = [];

  constructor(private storageService: StorageService) {
  }

  ngOnInit() {
    this.readData();
  }

  readData() {
    this.storageService.readScores().then(scores => {
      console.log('Scores loaded:', scores);
      this.topPlayers = scores.slice(0, 5);
    });
  }
}
