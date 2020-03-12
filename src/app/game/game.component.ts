import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MongodbService } from 'src/app/services/mongodb.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  isAnswerRequired = false;
  isSubmitted = false;
  isCorrect = false;
  firstButtonText = "DIFFERENT WORD?";
  randomWord = '';
  inputWord = '';
  listOfSynonyms = [];
  wordsCount: Number;
  answer = "";
  result = "";

  constructor(private router: Router, private mongodbService: MongodbService) { }

  ngOnInit(): void {
    this.firstButtonClick();
  }

  async firstButtonClick(): Promise<void> {
    this.listOfSynonyms.length = 0;
    this.isAnswerRequired = false;
    this.isSubmitted = false;
    this.isCorrect = false;
    this.inputWord = "";
    this.randomWord = "";
    this.answer = "";
    this.result = "";
    this.wordsCount = 0;
    this.firstButtonText = "DIFFERENT WORD?";

    //count words
    var countResult = await this.countWords();
    this.wordsCount = JSON.parse(JSON.stringify(countResult[0])).wordsCount;
    console.log("Number of words:", this.wordsCount);

    //get random word from wordnet
    var randomWordResult = await this.findWordByArrayPosition(this.getRandomNumber(0, this.wordsCount));
    this.randomWord = JSON.parse(JSON.stringify(randomWordResult[0])).word.k;
    console.log("Random word:", this.randomWord);

    //generate list of synonyms
    await this.getSynonyms(this.randomWord);
    console.log("list of synonyms", this.listOfSynonyms);
  }

  async submitButtonClick(): Promise<void> {

    this.isSubmitted = true;
    this.isAnswerRequired = false;
    this.isCorrect = false;
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

    //if no synonyms is the correct answer
    if(this.inputWord.toLowerCase().includes("no synonyms") && this.listOfSynonyms.length==0)
    {
      this.result = "Correct!\n\nThis word does not have any synonyms";
      return;
    }

    //if no synonyms is the input but there are synonyms
    if(this.inputWord.toLowerCase().includes("no synonyms") && this.listOfSynonyms.length!=0)
    {
      this.result = "Incorrect!\n\nThis word has synonyms";
      return;
    }

    //find word in mongodb
    var searchRes = await this.findWord(this.inputWord);

    //if no such word
    if(searchRes.toString().length == 0)
    {
      this.result = "There is no such word in Welsh";
      return;
    }

    //if word found
    for(var s of this.listOfSynonyms)
    {
      if(s.includes(this.inputWord))
      {
        this.result = "Correct!\n\nFull list of synonyms:\n" + this.listOfSynonyms.toString().split(",").join('\n');;
        this.isCorrect = true;
        this.firstButtonText = "TRY AGAIN?";
        return;
      }
    }

    this.result = "Incorrect.\n\nPlease try a different word or press SHOW ANSWER to see the synonyms";
  }

  showAnswerClick(): void {
    this.isAnswerRequired = true;
    this.isSubmitted = false;

    //if no synonyms for this word
    if (this.listOfSynonyms.length == 0)
    {
      this.answer = "This word has no synonyms";
    }
    //print list of synonyms
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

    //find word and its synsets
    var result = await this.findWord(word);
    var synsetList = JSON.parse(JSON.stringify(result[0])).words[0].v;
    console.log("Synset List: ", synsetList);


    for (var s of synsetList)     //cycle all synsets
    {
      var synsetFindRes = await this.findSynset(s); //find each synset in mongodb
      var wordsList = JSON.parse(JSON.stringify(synsetFindRes[0])).synsets[0].v;  //get word list for each synset
      console.log("Words List: ", wordsList);
      for (var w of wordsList)  //cycle all words in each synset
      {
        if(!this.listOfSynonyms.includes(w) && !w.includes(this.randomWord)) //check if a word is in the list already
        {
          this.listOfSynonyms.push(w);
        }
      }
    }
  }

}
