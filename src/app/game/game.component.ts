import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MongodbService } from 'src/app/services/mongodb.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  isGenerated = false;
  firstButtonText = "START";
  randomWord = '';
  inputWord = '';
  wordsCount: Number;

  constructor(private router: Router, private mongodbService: MongodbService) { }

  ngOnInit(): void {
  }

  async firstButtonClick(): Promise<void> {
    this.isGenerated = true;
    this.firstButtonText = "TRY AGAIN?";
    var countResult = await this.countWords();
    this.wordsCount = JSON.parse(JSON.stringify(countResult[0])).wordsCount;
    console.log("Number of words:", this.wordsCount);
  }

  submitButtonClick(): void {
    
  }

  countWords1() {
    console.log('in countwords');
    this.mongodbService.countWords().subscribe(
      data => {
        console.log(data);
      },
      error => {
        console.log(error);
      });
  }

  async countWords() {
    const count = await this.mongodbService.countWords().toPromise();
    return count;
  }

}
