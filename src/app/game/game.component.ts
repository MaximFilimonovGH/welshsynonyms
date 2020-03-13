import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MongodbService } from 'src/app/services/mongodb.service';

import { MongodbStitchService } from 'src/app/services/mongodb-stitch.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  isAnswerRequired = false;
  isSubmitted = false;
  isCorrect = false;
  isSynonymsAcquired = false;
  firstButtonText = "DIFFERENT WORD?";
  randomWord = '';
  inputWord = '';
  listOfSynonyms = [];
  wordsCount: Number;
  answer = "";
  result = "";
  databaseProgress = "";
  submitProgress = "";

  isStitch = true;

  constructor(private router: Router,
    private mongodbService: MongodbService,
    private mongodbstitchService: MongodbStitchService
    ) { }

  async ngOnInit(): Promise<void> {
    this.firstButtonClick();
  }

  async firstButtonClick(): Promise<void> {
    this.listOfSynonyms.length = 0;
    this.isAnswerRequired = false;
    this.isSubmitted = false;
    this.isCorrect = false;
    this.isSynonymsAcquired = false;
    this.inputWord = "";
    this.randomWord = "";
    this.answer = "";
    this.result = "";
    this.databaseProgress = "";
    this.wordsCount = 0;
    this.firstButtonText = "DIFFERENT WORD?";

    var countResult;
    var randomWordResult;
    this.databaseProgress = "Working with Welsh WordNet. Please wait...\n";
    
    if (!this.isStitch)
    {
      //count words
      countResult = await this.countWords();
      this.wordsCount = JSON.parse(JSON.stringify(countResult[0])).wordsCount;
  
      //get random word from wordnet
      randomWordResult = await this.findWordByArrayPosition(this.getRandomNumber(0, this.wordsCount));
      this.randomWord = JSON.parse(JSON.stringify(randomWordResult[0])).word.k;
  
      //generate list of synonyms
      await this.getSynonyms(this.randomWord);
    }
    else
    {
      //count words
      countResult = await this.countWordsStitch();
      this.wordsCount = JSON.parse(JSON.stringify(countResult[0])).wordsCount;
  
      //get random word from wordnet
      randomWordResult = await this.findWordByArrayPositionStitch(this.getRandomNumber(0, this.wordsCount));
      this.randomWord = JSON.parse(JSON.stringify(randomWordResult[0])).word.k;
  
      //generate list of synonyms
      await this.getSynonyms(this.randomWord);
    }
    console.log("Number of words:", this.wordsCount);
    console.log("Random word:", this.randomWord);
    console.log("list of synonyms", this.listOfSynonyms);
    this.databaseProgress = "";
    this.isSynonymsAcquired = true;
  }

  async submitButtonClick(): Promise<void> {

    this.isSubmitted = true;
    this.isAnswerRequired = false;
    this.isCorrect = false;
    this.result = "Checking...";
    

    //if no input
    if(this.inputWord.length==0)
    {
      this.result = "Please input a word";
      return;
    }

    //if same word 
    if(this.inputWord == this.randomWord)
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
    var searchRes;

    if(!this.isStitch)
    {
      searchRes = await this.findWord(this.inputWord);
    }
    else
    {
      searchRes = await this.findWordStitch(this.inputWord);
    }

    //if no such word
    if(searchRes.toString().length == 0)
    {
      this.result = "There is no such word in Welsh";
      return;
    }

    //if word found
    for(var s of this.listOfSynonyms)
    {
      if(s == this.inputWord)
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

  async getSynonyms(word) {

    //find word and its synsets
    var wordFindResult;
    if(!this.isStitch)
    {
      wordFindResult = await this.findWord(word);
    }
    else
    {
      wordFindResult = await this.findWordStitch(word);
    }

    console.log("Found word for synonyms:", wordFindResult);

    var synsetList = JSON.parse(JSON.stringify(wordFindResult[0])).words[0].v;
    console.log("Synset List: ", synsetList);


    for (var s of synsetList)     //cycle all synsets
    {
       //find each synset in mongodb
      var synsetFindRes;
      if(!this.isStitch)
      {
        synsetFindRes = await this.findSynset(s);
      }
      else
      {
        synsetFindRes = await this.findSynsetStitch(String(s));
      }

      //get word list for each synset
      var wordsList = JSON.parse(JSON.stringify(synsetFindRes[0])).synsets[0].v; 
      console.log("Words List: ", wordsList);
      
      //cycle all words in each synset
      for (var w of wordsList)  
      {
        if(!this.listOfSynonyms.includes(w) && w != this.inputWord) //check if a word is in the list already
        {
          this.listOfSynonyms.push(w);
        }
      }
    }
  }
  
  getRandomNumber(min, max): Number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  //own backend implementation
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

  //mongodb stitch implementation
  async findWordStitch(word) {
    const result = await this.mongodbstitchService.findWord(word);
    return result;
  }

  async countWordsStitch() {
    const count = await this.mongodbstitchService.countWords();
    return count;
  }

  async findWordByArrayPositionStitch(arrNumber) {
    const result = await this.mongodbstitchService.findWordByArrayPosition(arrNumber);
    return result;
  }

  async findSynsetStitch(synset) {
    const result = await this.mongodbstitchService.findSynset(synset);
    return result;
  }
  
  async getSynonymsStitch(word) {

    //find word and its synsets
    var result = await this.findWordStitch(word);
    console.log("Found word for synonyms:", result);

    var synsetList = JSON.parse(JSON.stringify(result[0])).words[0].v;
    console.log("Synset List: ", synsetList);

    for (var s of synsetList)     //cycle all synsets
    {
      var synsetFindRes = await this.findSynsetStitch(String(s)); //find each synset in mongodb

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
