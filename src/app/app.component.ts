import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { GameComponent } from './game/game.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  isStarted = false;

  constructor(private router: Router) {}

  title = 'Game of Welsh Words';

  startButtonClick(): void {
    this.isStarted = true;
  }

  resetApp(): void {
    this.isStarted = false;
  }
}
