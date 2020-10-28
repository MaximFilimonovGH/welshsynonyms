import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { GameComponent } from './game/game.component';
import { ThemePalette } from '@angular/material/core';

import { RouteService } from './services/route-service.service';
import { Subscription }   from 'rxjs';

interface DifficultLevel {
  id: number;
  viewValue: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy{

  isStarted = false;
  isAdvanced = false;
  selectedDifficultyId = 20;
  forwardData;

  subscription: Subscription;

  aboutView = false;

  difficultyLevels: DifficultLevel[] = [
    {id: 10, viewValue: 'Beginner'},
    {id: 20, viewValue: 'Intermediate'},
    {id: 30, viewValue: 'Advanced'},
    {id: 40, viewValue: 'Expert'},
    {id: 50, viewValue: 'Master'}
  ];

  constructor(private router: Router, private routeService: RouteService) {
    this.subscription = routeService.routeChanged$.subscribe(
      value => {
        this.aboutView = true;
    });
  }

  title = 'Game of Welsh Words';

  startButtonClick(): void {
    for (var dif of this.difficultyLevels)
    {
      if(dif.id == this.selectedDifficultyId)
      {
        var selectedDifficulty = dif.viewValue;
        break;
      }
    }

    console.log(this.selectedDifficultyId);

    this.forwardData = {
      "selectedDifficultyId": this.selectedDifficultyId,
      "selectedDifficulty": selectedDifficulty,
      "difficultyLevels": this.difficultyLevels
    }

    this.isStarted = true;
  }

  resetApp(): void {
    this.isStarted = false;
    this.isAdvanced = false;
    this.aboutView = false;
    this.router.navigateByUrl('')
  }

  onSlideChange(): void {
    this.isAdvanced = !this.isAdvanced;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
