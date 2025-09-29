import {Component, OnInit} from '@angular/core';
import {StorageService} from '../services/storage.service';
import {Router} from '@angular/router';
import {Gamer} from '../models/pokemon.model';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-leaderboard',
  imports: [
    NgClass
  ],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.scss'
})
export class LeaderboardComponent implements OnInit {

  topPlayers: Gamer[] = [];

  constructor(private storageService: StorageService,
              private router: Router) {
  }

  ngOnInit() {
    this.readData();
  }

  readData() {
    this.storageService.readScores().then(scores => {
      this.topPlayers = scores.slice(0, 5);
    }).catch(error => {
      this.topPlayers = this.storageService.getDataFromLocalStorage();
    });
  }

  backToHome() {
    this.router.navigate(['/']);
  }
}
