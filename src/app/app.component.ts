import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { GameComponent } from './game/game.component';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  isStarted = false;
  isRealm = true;
  toggleColor: ThemePalette = "primary";

  constructor(private router: Router) {}

  title = 'Game of Welsh Words';

  startButtonClick(): void {
    this.isStarted = true;
  }

  resetApp(): void {
    this.isStarted = false;
    this.isRealm = false;
  }

  onSlideChange(): void {
    this.isRealm = !this.isRealm;
  }
}
