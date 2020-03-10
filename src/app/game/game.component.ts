import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  firstButtonClick(): void {
    this.isGenerated = true;
    this.firstButtonText = "TRY AGAIN?";
    
  }

  submitButtonClick(): void {
  }

}
