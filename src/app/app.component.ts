import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { RouteService } from './services/route-service.service';
import { Subscription }   from 'rxjs';

interface DifficultLevel {
  id: number;
  viewValue: string;
}

interface GameVariant {
  id: number;
  viewValue: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy{

  isStarted = false;
  selectedDifficultyId = 20;
  forwardData;
  gameName = "One Word";

  subscription: Subscription;

  aboutView = false;

  difficultyLevels: DifficultLevel[] = [
    {id: 10, viewValue: 'Beginner'},
    {id: 20, viewValue: 'Intermediate'},
    {id: 30, viewValue: 'Advanced'},
    {id: 40, viewValue: 'Expert'},
    {id: 50, viewValue: 'Master'}
  ];

  gameVariants: GameVariant[] = [
    {id: 10, viewValue: 'One Word'},
    {id: 20, viewValue: 'Ten Words'}
  ]
  selectedGameModeId = this.gameVariants[0].id;
  selectedGameMode = this.gameVariants[0].viewValue;

  constructor(private router: Router, private routeService: RouteService) {
    this.subscription = routeService.routeChanged$.subscribe(
      value => {
        this.aboutView = true;
    });
  }

  title = 'Game of Welsh Words';

  startButtonClick(): void {
    for (var dif of this.difficultyLevels) {
      if(dif.id == this.selectedDifficultyId) {
        var selectedDifficulty = dif.viewValue;
        break;
      }
    }

    for (var gamemode of this.gameVariants) {
      if (gamemode.id == this.selectedGameModeId) {
        var selectedGameMode = gamemode.viewValue;
        break;
      }
    }

    console.log(`Selected game mode: "${selectedGameMode}" with id: ${this.selectedGameModeId}`);
    console.log(`Selected difficulty level: "${selectedDifficulty}" with id: ${this.selectedDifficultyId}`);

    this.forwardData = {
      "selectedDifficultyId": this.selectedDifficultyId,
      "selectedDifficulty": selectedDifficulty,
      "difficultyLevels": this.difficultyLevels
    }

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
