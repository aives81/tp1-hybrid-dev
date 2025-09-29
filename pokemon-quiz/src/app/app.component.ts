import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';

declare var window: any;

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'pokemon-quiz';

  ngOnInit(): void {
    document.addEventListener('deviceready', () => {
      console.log('✅ Cordova ready');
      console.log('Data dir:', window.cordova.file.dataDirectory);
    });
  }
}
