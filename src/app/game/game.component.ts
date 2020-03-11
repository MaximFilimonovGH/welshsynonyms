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
  isAnswerRequired = false;
  isSubmitted = false;
  isCorrect = false;
  firstButtonText = "START";
  randomWord = '';
  inputWord = '';
  listOfSynonyms = [];
  wordsCount: Number;
  answer = "";
  result = "";

  constructor(private router: Router, private mongodbService: MongodbService) { }

  ngOnInit(): void {
  }

  async firstButtonClick(): Promise<void> {
    this.listOfSynonyms.length = 0;
    this.isGenerated = true;
    this.isAnswerRequired = false;
    this.isSubmitted = false;
    this.isCorrect = false;
    this.inputWord = "";
    this.answer = "";
    this.result = "";
    this.firstButtonText = "TRY AGAIN?";

    var countResult = await this.countWords();
    this.wordsCount = JSON.parse(JSON.stringify(countResult[0])).wordsCount;
    console.log("Number of words:", this.wordsCount);

    var randomWordResult = await this.findWordByArrayPosition(this.getRandomNumber(0, this.wordsCount));
    this.randomWord = JSON.parse(JSON.stringify(randomWordResult[0])).word.k;
    console.log("Random word:", this.randomWord);

    await this.getSynonyms(this.randomWord);
    console.log("list of synonyms", this.listOfSynonyms);
    
  }

  async submitButtonClick(): Promise<void> {

    this.isSubmitted = true;
    this.isAnswerRequired = false;
    this.result = "";

    //if no input
    if(this.inputWord.length==0)
    {
      this.result = "Please input a word";
      return;
    }

    //if same word 
    if(this.inputWord.includes(this.randomWord))
    {
      this.result = "Please type a different word from the original";
      return;
    }

    //find word in mongodb
    var searchRes = await this.findWord(this.inputWord);

    //if no such word
    if(searchRes.toString().length == 0)
    {
      this.result = "No such word in Welsh";
      return;
    }

    //if word found
    for(var s of this.listOfSynonyms)
    {
      if(s.includes(this.inputWord))
      {
        this.result = "Correct!\n\nFull list of synonyms:\n" + this.listOfSynonyms.toString().split(",").join('\n');;
        this.isCorrect = true;
        return;
      }
    }
    this.result = "Incorrect.\nPlease try a different word or press SHOW ANSWER to see the synonyms";

  }

  showAnswerClick(): void {
    this.isAnswerRequired = true;
    this.isSubmitted = false;
    if (this.listOfSynonyms.length == 0)
    {
      this.answer = "This word has no synonyms";
    }
    else
    {
      this.answer = this.listOfSynonyms.toString().split(",").join('\n');
    }

  }

  async countWords() {
    const count = await this.mongodbService.countWords().toPromise();
    return count;
  }

  async findWordByArrayPosition(arrNumber) {
    const result = await this.mongodbService.findWordByArrayPosition(arrNumber).toPromise();
    return result;
  }

  async findWord(word) {
    const result = await this.mongodbService.findWord(word).toPromise();
    return result;
  }

  async findSynset(synset) {
    const result = await this.mongodbService.findSynset(synset).toPromise();
    return result;
  }

  getRandomNumber(min, max): Number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  async getSynonyms(word) {

    var result = await this.findWord(word);
    var synsetList = JSON.parse(JSON.stringify(result[0])).words[0].v;
    console.log("Synset List: ", synsetList);

    for (var s of synsetList)
    {
      var synsetFindRes = await this.findSynset(s);
      var wordsList = JSON.parse(JSON.stringify(synsetFindRes[0])).synsets[0].v;
      console.log("Words List: ", wordsList);
      for (var w of wordsList)
      {
        if(!this.listOfSynonyms.includes(w) && !w.includes(this.randomWord))
        {
          this.listOfSynonyms.push(w);
        }
      }
    }
  }

}
