import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { RouteService } from './services/route-service.service';
import { Subscription }   from 'rxjs';

interface DifficultLevel {
  id: number;
  level_english: string;
  level_welsh: string;
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
export class AppComponent implements OnInit, OnDestroy{

  isStarted = false;
  forwardData;

  timeLimit = 5;
  questionsNumber = 10;

  subscription: Subscription;
  aboutView = false;

  difficultyLevels: DifficultLevel[] = [
    {id: 10, level_english: 'Entry', level_welsh: 'Mynediad'},
    {id: 20, level_english: 'Foundation', level_welsh: 'Sylfaen'},
    {id: 30, level_english: 'Intermediate', level_welsh: 'Canolradd'},
    {id: 40, level_english: 'Advanced', level_welsh: 'Uwch'}
  ];
  selectedDifficultyId = this.difficultyLevels[0].id;
  selectedDifficultyEng = this.difficultyLevels[0].level_english;
  selectedDifficultyWelsh = this.difficultyLevels[0].level_welsh;
  difSliderMax;
  difSliderMin;
  difSliderTick;
  lowestDifficultyEng = this.difficultyLevels[0].level_english;
  hardestDifficultyEng = this.difficultyLevels[this.difficultyLevels.length-1].level_english;
  lowestDifficultyWelsh = this.difficultyLevels[0].level_welsh;
  hardestDifficultyWelsh = this.difficultyLevels[this.difficultyLevels.length-1].level_welsh;

  gameVariants: GameVariant[] = [
    {id: 10, viewValue: 'Practice'},
    {id: 20, viewValue: 'Test'}
  ]
  selectedGameModeId = this.gameVariants[0].id;
  selectedGameMode = this.gameVariants[0].viewValue;

  constructor(private router: Router, private routeService: RouteService) {
    this.subscription = routeService.routeChanged$.subscribe(
      value => {
        this.aboutView = true;
    });
  }
  
  ngOnInit(): void {
    //get values for difficulty slider
    this.difSliderMin = this.difficultyLevels[0].id;
    this.difSliderMax = this.difficultyLevels[this.difficultyLevels.length-1].id;
    this.difSliderTick = this.difficultyLevels[1].id - this.difficultyLevels[0].id;
  }

  title = 'Welsh Synonyms Games';

  startButtonClick(): void {
    for (var dif of this.difficultyLevels) {
      if(dif.id == this.selectedDifficultyId) {
        var selectedDifficultyEng = dif.level_english;
        var selectedDifficultyWelsh = dif.level_welsh;
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
    console.log(`Selected difficulty level: "${selectedDifficultyEng}" or "${selectedDifficultyWelsh}" with id: ${this.selectedDifficultyId}`);

    this.forwardData = {
      "selectedDifficultyId": this.selectedDifficultyId,
      "selectedDifficultyEng": selectedDifficultyEng,
      "selectedDifficultyWelsh": selectedDifficultyWelsh,
      "difficultyLevels": this.difficultyLevels,
      "timeLimit": this.timeLimit,
      "questionsNumber": this.questionsNumber,
      "difficultySliderSettings": {
        "difSliderMin": this.difSliderMin,
        "difSliderMax": this.difSliderMax,
        "difSliderTick": this.difSliderTick,
        "lowestDifficultyEng": this.lowestDifficultyEng,
        "hardestDifficultyEng": this.hardestDifficultyEng,
        "lowestDifficultyWelsh": this.lowestDifficultyWelsh,
        "hardestDifficultyWelsh": this.hardestDifficultyWelsh,
      }
    }

    this.isStarted = true;
  }

  resetApp(data: boolean): void {
    this.isStarted = false;
    this.aboutView = false;
    this.router.navigateByUrl('')
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  setDifficultyLevel(id) {
    for (var dif of this.difficultyLevels) {
      if(dif.id == id) {
        this.selectedDifficultyEng = dif.level_english;
        this.selectedDifficultyWelsh = dif.level_welsh;
        return;
      }
    }
  }
}
