import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { RouteService } from './services/route-service.service';
import { Subscription }   from 'rxjs';

import { ActivatedRoute } from '@angular/router';

interface DifficultyLevel {
  id: number;
  level_english: string;
  level_welsh: string;
}

interface GameVariant {
  id: number;
  eng: string;
  wel: string;
  viewValue: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{

  //is Welsh Version of the game or English?
  isWelsh = true;
  language = "en";

  //different texts for Welsh and English versions

  isStarted = false;
  forwardData;

  timeLimit = 5;
  questionsNumber = 10;

  subscription: Subscription;
  aboutView = false;

  difficultyLevels: DifficultyLevel[] = [
    {id: 10, level_english: 'Entry', level_welsh: 'Mynediad'},
    {id: 20, level_english: 'Foundation', level_welsh: 'Sylfaen'},
    {id: 30, level_english: 'Intermediate', level_welsh: 'Canolradd'},
    {id: 40, level_english: 'Advanced', level_welsh: 'Uwch'}
  ];
  selectedDifficultyId = this.difficultyLevels[0].id;
  selectedDifficulty;
  difSliderMax;
  difSliderMin;
  difSliderTick;
  lowestDifficulty;
  hardestDifficulty;

  gameVariants: GameVariant[] = [
    {id: 10, eng: 'Practice', wel: "Ymarfer", viewValue: "Practice"},
    {id: 20, eng: 'Test', wel: "Prawf", viewValue: "Test"}
  ]
  selectedGameModeId = this.gameVariants[0].id;

  difficultyText;
  startButtonText;
  questionNumberText;
  timeLimitText;


  constructor(private router: Router, private routeService: RouteService, private activeRoute: ActivatedRoute) {
    this.subscription = routeService.routeChanged$.subscribe(
      value => {
        this.aboutView = true;
    });
  }
  
  ngOnInit(): void {
    // check for parameters and set language
    console.log(this.activeRoute);
    this.activeRoute.queryParamMap.subscribe(queryParamMap => {
      this.language = queryParamMap['language'];
      console.log(queryParamMap);
      if (this.language == "cy") {
        this.isWelsh = true;
      } else {
        this.isWelsh = false;
      }
    });
    // if (this.language == "cy") {
    //   this.isWelsh = true;
    // } else {
    //   this.isWelsh = false;
    // }

    //get values for difficulty slider
    this.difSliderMin = this.difficultyLevels[0].id;
    this.difSliderMax = this.difficultyLevels[this.difficultyLevels.length-1].id;
    this.difSliderTick = this.difficultyLevels[1].id - this.difficultyLevels[0].id;

    // check if Welsh and assign view values for difficulty and gamevariant (test/practice)
    if (this.isWelsh) {
      this.gameVariants[0].viewValue = this.gameVariants[0].wel;
      this.gameVariants[1].viewValue = this.gameVariants[1].wel;
      this.lowestDifficulty = this.difficultyLevels[0].level_welsh;
      this.hardestDifficulty = this.difficultyLevels[this.difficultyLevels.length-1].level_welsh;
      this.difficultyText = "Anhawster a ddewiswyd";
      this.startButtonText = "DECHRAU";
      this.timeLimitText = "Terfyn amser (munudau)";
      this.questionNumberText = "Nifer y cwestiynau";
    }
    else {
      this.gameVariants[0].viewValue = this.gameVariants[0].eng;
      this.gameVariants[1].viewValue = this.gameVariants[1].eng;
      this.lowestDifficulty = this.difficultyLevels[0].level_english;
      this.hardestDifficulty = this.difficultyLevels[this.difficultyLevels.length-1].level_english;
      this.difficultyText = "Chosen difficulty";
      this.startButtonText = "START";
      this.timeLimitText = "Time limit (minutes)";
      this.questionNumberText = "Number of questions";
    }
    this.selectedDifficulty = this.lowestDifficulty;
  }

  title = 'Welsh Synonyms Games';

  startButtonClick(): void {

    // console log the selected dif and gamemode
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

    // generate forward Data object to pass onto the game
    this.forwardData = {
      "isWelsh": this.isWelsh,
      "difficultyLevels": this.difficultyLevels,
      "selectedDifficultyId": this.selectedDifficultyId,
      "timeLimit": this.timeLimit,
      "questionsNumber": this.questionsNumber,
      "difficultySliderSettings": {
        "difSliderMin": this.difSliderMin,
        "difSliderMax": this.difSliderMax,
        "difSliderTick": this.difSliderTick
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
        this.selectedDifficultyId = id;
        if (this.isWelsh) {
          this.selectedDifficulty = dif.level_welsh;
        }
        else {
          this.selectedDifficulty = dif.level_english;
        }
        return;
      }
    }
  }
}
