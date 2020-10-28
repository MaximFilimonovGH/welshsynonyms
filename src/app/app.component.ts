import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { GameComponent } from './game/game.component';
import { ThemePalette } from '@angular/material/core';

import { RouteService } from './services/route-service.service';
import { Subscription }   from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy{

  isStarted = false;
  toggleColor: ThemePalette = "primary";

  subscription: Subscription;

  aboutView = false;

  constructor(private router: Router, private routeService: RouteService) {
    this.subscription = routeService.routeChanged$.subscribe(
      value => {
        this.aboutView = true;
    });
  }

  title = 'Game of Welsh Words';

  startButtonClick(): void {
    this.isStarted = true;
  }

  resetApp(): void {
    this.isStarted = false;
    this.aboutView = false;
    this.router.navigateByUrl('')
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
