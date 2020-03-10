import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { GameComponent } from './game/game.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private router: Router) {}

  title = 'welshsynonyms';

  gameButtonClick(): void {
    this.router.navigateByUrl('/game');
  }
}
