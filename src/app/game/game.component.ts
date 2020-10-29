import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { MongodbService } from 'src/app/services/mongodb.service';

interface DifficultLevel {
  id: number;
  viewValue: string;
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  constructor(private router: Router,
    private mongodbService: MongodbService) { }

  @Input() data: any;

  isAnswerRequested = false;
  isSubmitted = false;
  isCorrect = false;
  isSynonymsAcquired = false;

  selectedDifficulty;
  selectedDifficultyId;
  difficultyLevels: DifficultLevel[];
  difSliderMax;
  difSliderMin;
  difSliderTick;
  lowestDifficulty;
  hardestDifficulty;
  
  firstButtonText = "SKIP";
  randomWord = '';
  inputWord = '';
  listOfSynonyms = [];
  wordsCount: Number;
  answer = "";
  result = "";
  databaseProgress = "";
  submitProgress = "";

  async ngOnInit(): Promise<void> {
    //count words in wordNet database
    var countResult;
    countResult = await this.countWords();
    this.wordsCount = JSON.parse(JSON.stringify(countResult[0])).wordsCount;

    this.selectedDifficulty = this.data.selectedDifficulty;
    this.selectedDifficultyId = this.data.selectedDifficultyId;
    this.difficultyLevels = this.data.difficultyLevels;
    this.difSliderMax = this.data.difficultySliderSettings.difSliderMax;
    this.difSliderMin = this.data.difficultySliderSettings.difSliderMin;
    this.difSliderTick = this.data.difficultySliderSettings.difSliderTick;
    this.lowestDifficulty = this.data.difficultySliderSettings.lowestDifficulty;
    this.hardestDifficulty = this.data.difficultySliderSettings.hardestDifficulty;

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
    this.firstButtonText = "SKIP";

    var randomWordResult;
    var randomWordCheck;

    this.databaseProgress = "Working with Welsh WordNet. Please wait...\n";


    
    //get random word from wordnet
    randomWordResult = await this.findWordByArrayPosition(this.getRandomNumber(0, this.wordsCount));
    randomWordCheck = JSON.parse(JSON.stringify(randomWordResult[0])).word.k;

    //generate list of synonyms
    await this.getSynonyms(randomWordCheck);

    //if there are synonyms then it's a good word
    if (this.listOfSynonyms.length != 0) {
      this.randomWord = randomWordCheck;
    }
    //if list of synonyms is empty
    if (this.listOfSynonyms.length == 0)
    {
      this.firstButtonClick();
    }

    this.databaseProgress = "";
    this.isSynonymsAcquired = true;
  }

  async submitButtonClick(): Promise<void> {
    this.isSubmitted = true;
    this.isAnswerRequested = false;
    this.isCorrect = false;
    this.result = "Checking...";
    
    //if no input
    if(this.inputWord.length == 0)
    {
      this.result = "Please input a word";
      return;
    }

    this.inputWord = this.inputWord.toLowerCase();

    //if same word 
    if(this.inputWord == this.randomWord)
    {
      this.result = "Please input a different word";
      return;
    }

        // no synonyms implementation
    //if no synonyms is the correct answer
    // if(this.inputWord.toLowerCase().includes("no synonyms") && this.listOfSynonyms.length==0)
    // {
    //   this.result = "Correct!\n\nThis word does not have any synonyms";
    //   this.isCorrect = true;
    //   this.firstButtonText = "TRY AGAIN?";
    //   return;
    // }

    //if no synonyms is the input but there are synonyms
    // if(this.inputWord.toLowerCase().includes("no synonyms") && this.listOfSynonyms.length!=0)
    // {
    //   this.result = "Incorrect!\n\nThis word has synonyms";
    //   return;
    // }

    //find word in mongodb
    let searchRes;
    searchRes = await this.findWord(this.inputWord);

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
        this.firstButtonText = "NEW WORD";
        return;
      }
    }

    this.result = "Incorrect.\n\nPlease try a different word or press HINT to see the synonyms";
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

  translateClick(): void {
    let url = "https://glosbe.com/cy/en/" + this.randomWord;
    window.open(url, "_blank", "noopener");
  }

  async getSynonyms(word) {

    //find word and its synsets
    var wordFindResult;
    var synsetList;
    wordFindResult = await this.findWord(word);
    synsetList = JSON.parse(JSON.stringify(wordFindResult[0])).words[0].v;
    //console.log("Synset List: ", synsetList);

    for (var s of synsetList)     //cycle all synsets
    {
       //find each synset in mongodb
      var synsetFindRes;
      var wordsList;
      synsetFindRes = await this.findSynset(s);
      wordsList = JSON.parse(JSON.stringify(synsetFindRes[0])).synsets[0].v;

      //get word list for each synset
      
      //cycle all words in each synset
      for (var w of wordsList)  
      {
        if(!this.listOfSynonyms.includes(w) && w != word) //check if a word is in the list already
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

  setDifficultyLevel(id) {
    for (var dif of this.difficultyLevels) {
      if(dif.id == id) {
        this.selectedDifficulty = dif.viewValue;
        return;
      }
    }
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
}
