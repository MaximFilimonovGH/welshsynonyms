import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { MongodbService } from 'src/app/services/mongodb.service';

import { MongodbRealmService } from 'src/app/services/mongodb-realm.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  @Input() data: boolean;

  isRealm: boolean;

  isAnswerRequested = false;
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

  constructor(private router: Router,
    private mongodbService: MongodbService,
    //private mongodbstitchService: MongodbStitchService,
    private mongodbRealmService: MongodbRealmService
    ) { }

  async ngOnInit(): Promise<void> {
    this.isRealm = this.data;
    // var test = await this.findWordByArrayPositionStitch(31322);
    // console.log("TEST: ", test.word);
    this.firstButtonClick();
  }

  async firstButtonClick(): Promise<void> {
    this.listOfSynonyms.length = 0;
    this.isAnswerRequested = false;
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
    
    if (!this.isRealm)
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
      countResult = await this.countWordsRealm();
      this.wordsCount = countResult.wordsCount;
  
      //get random word from wordnet
      randomWordResult = await this.findWordByArrayPositionRealm(this.getRandomNumber(0, this.wordsCount));
      this.randomWord = randomWordResult.word.k;
  
      //generate list of synonyms
      await this.getSynonyms(this.randomWord);
    }
    //console.log("Number of words:", this.wordsCount);
    //console.log("Random word:", this.randomWord);
    //console.log("list of synonyms", this.listOfSynonyms);
    //console.log("Is it Realm? ", this.isRealm);
    this.databaseProgress = "";
    this.isSynonymsAcquired = true;
  }

  async submitButtonClick(): Promise<void> {

    this.isSubmitted = true;
    this.isAnswerRequested = false;
    this.isCorrect = false;
    this.result = "Checking...";
    

    //if no input
    if(this.inputWord.length==0)
    {
      this.result = "Please input a word";
      return;
    }

    this.inputWord = this.inputWord.toLowerCase();

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
      this.isCorrect = true;
      this.firstButtonText = "TRY AGAIN?";
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

    if(!this.isRealm)
    {
      searchRes = await this.findWord(this.inputWord);
    }
    else
    {
      searchRes = await this.findWordRealm(this.inputWord);
    }
    //console.log("searchRes of input:", searchRes);

    //if no such word
    if(searchRes.length == 0)
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
    this.isAnswerRequested = true;
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
    var synsetList;
    if(!this.isRealm)
    {
      wordFindResult = await this.findWord(word);
      synsetList = JSON.parse(JSON.stringify(wordFindResult[0])).words[0].v;
    }
    else
    {
      wordFindResult = await this.findWordRealm(word);
      synsetList = wordFindResult.words[0].v
    }
    //console.log("Synset List: ", synsetList);


    for (var s of synsetList)     //cycle all synsets
    {
       //find each synset in mongodb
      var synsetFindRes;
      var wordsList;
      if(!this.isRealm)
      {
        synsetFindRes = await this.findSynset(s);
        wordsList = JSON.parse(JSON.stringify(synsetFindRes[0])).synsets[0].v;
      }
      else
      {
        synsetFindRes = await this.findSynsetRealm(String(s));
        wordsList = synsetFindRes.synsets[0].v;
      }

      //get word list for each synset
      //console.log("Words List: ", wordsList);
      
      //cycle all words in each synset
      for (var w of wordsList)  
      {
        if(!this.listOfSynonyms.includes(w) && w != this.randomWord) //check if a word is in the list already
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
    const count = await this.mongodbService.countWords().toPromise().catch(error => console.log(error));
    return count;
  }

  async findWordByArrayPosition(arrNumber) {
    const result = await this.mongodbService.findWordByArrayPosition(arrNumber).toPromise().catch(error => console.log(error));
    return result;
  }

  async findWord(word) {
    const result = await this.mongodbService.findWord(word).toPromise().catch(error => console.log(error));
    return result;
  }

  async findSynset(synset) {
    const result = await this.mongodbService.findSynset(synset).toPromise().catch(error => console.log(error));
    return result;
  }

  //mongodb realm implementation

  async findWordRealm(word) {
    const result = await this.mongodbRealmService.findWord(word).catch(error => console.log(error));
    return result;
  }

  async countWordsRealm() {
    const count = await this.mongodbRealmService.countWords().catch(error => console.log(error));
    return count;
  }

  async findWordByArrayPositionRealm(arrNumber) {
    const result = await this.mongodbRealmService.findWordByArrayPosition(arrNumber).catch(error => console.log(error));
    return result;
  }

  async findSynsetRealm(synset) {
    const result = await this.mongodbRealmService.findSynset(synset).catch(error => console.log(error));
    return result;
  }
  
   async getSynonymsRealm(word) {

    //find word and its synsets
    var result = await this.findWordRealm(word);
    //console.log("Found word for synonyms:", result);

    var synsetList = JSON.parse(JSON.stringify(result[0])).words[0].v;
    //console.log("Synset List: ", synsetList);

    for (var s of synsetList)     //cycle all synsets
    {
      var synsetFindRes = await this.findSynsetRealm(String(s)); //find each synset in mongodb

      var wordsList = JSON.parse(JSON.stringify(synsetFindRes[0])).synsets[0].v;  //get word list for each synset
      //console.log("Words List: ", wordsList);
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
