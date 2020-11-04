import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';

import { MongodbService } from 'src/app/services/mongodb.service';
import { MatDialog } from '@angular/material/dialog';

import { HintDialogComponent } from 'src/app/game-advanced/hint-dialog/hint-dialog.component';
import { CountdownComponent } from 'ngx-countdown';

interface DifficultLevel {
  id: number;
  level_english: string;
  level_welsh: string;
}



@Component({
  selector: 'app-game-advanced',
  templateUrl: './game-advanced.component.html',
  styleUrls: ['./game-advanced.component.css']
})
export class GameAdvancedComponent implements OnInit {

  constructor(private mongodbService: MongodbService,
    private dialog: MatDialog) { }

  @Input() data: any;

  @Output() onResetRequested: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('cd', { static: false }) private countdown: CountdownComponent;

  isSubmitted = false;
  isWordListAcquired = false;
  firstButtonText = "SKIP";
  databaseProgress = '';
  gameResult = '';
  gameResult2 = '';

  selectedDifficultyId;
  difficultyLevels: DifficultLevel[];
  difSliderMax;
  difSliderMin;
  difSliderTick;
  selectedDifficultyEng;
  lowestDifficultyEng;
  hardestDifficultyEng;
  selectedDifficultyWelsh;
  lowestDifficultyWelsh;
  hardestDifficultyWelsh;

  words = [];

  countdownConfig = {
    leftTime: 10,
    stopTime: 0,
    format: 'm:s.S'
  };
  timesUp = false;

  async ngOnInit(): Promise<void> {

    //get data from main component regarding difficulty settings
    this.selectedDifficultyEng = this.data.selectedDifficultyEng;
    this.selectedDifficultyId = this.data.selectedDifficultyId;
    this.difficultyLevels = this.data.difficultyLevels;
    this.difSliderMax = this.data.difficultySliderSettings.difSliderMax;
    this.difSliderMin = this.data.difficultySliderSettings.difSliderMin;
    this.difSliderTick = this.data.difficultySliderSettings.difSliderTick;
    this.lowestDifficultyEng = this.data.difficultySliderSettings.lowestDifficultyEng;
    this.hardestDifficultyEng = this.data.difficultySliderSettings.hardestDifficultyEng;

    this.selectedDifficultyWelsh = this.data.selectedDifficultyWelsh;
    this.lowestDifficultyWelsh = this.data.difficultySliderSettings.lowestDifficultyWelsh;
    this.hardestDifficultyWelsh = this.data.difficultySliderSettings.hardestDifficultyWelsh;

    this.startButtonClick();
  }

  async startButtonClick() {
    this.timesUp = false;
    this.gameResult = '';
    this.gameResult2 = '';
    this.databaseProgress = '';
    this.isWordListAcquired = false;
    this.isSubmitted = false;
  
    //get words from welshWords lists
    await this.getRandomWords(this.selectedDifficultyWelsh.toLowerCase());

    //get words from wordNet disregarding difficulty
    //await this.getRandomWordsWordNet();

    this.countdown.begin();
  }

  handleCountdownEvent($event) {
    if ($event.action == "done") {
      this.timesUp = true;
      this.gameResult = "Time is up! Please submit your answers.";
    }
  }

  backButtonClick(data: boolean): void {
    this.onResetRequested.emit(data);
  }

  showHintClick(wordData) {
    const dialogRef = this.dialog.open(HintDialogComponent, {
       data: wordData
    });
  }

  async getRandomWords(level_welsh) {
    this.databaseProgress = "Working with Welsh WordNet. Please wait...\n";
    //null existing words
    this.words.length = 0;
    let count = 0;

    while(true) {
      //get a random word
      let randomWordResult = await this.getRandomWordFromDatabase(level_welsh);
      let randomWord = randomWordResult[0].word
      //check if this word is in wordNet
      let wordNetCheck;
      wordNetCheck = await this.findWord(randomWord);
      //if word is in wordNet
      if (wordNetCheck.length != 0) {
        //check if this word has synonyms
        let synonymList = await this.getSynonyms(randomWord);

        //if word has synonyms
        if (synonymList.length != 0) {
          //check if word is already in the list
          let isListed = false;
          for (let i = 0; i < this.words.length; i++) {
            if (this.words[i].word == randomWord) {
              isListed = true;
              break;
            }
          }
          //if this word is not listed in the words list already
          if(!isListed) {
            let singleEntry = {
              "word": randomWord,
              "synonymList": synonymList,
              "inputWord": '',
              "result": ''
            }
            this.words.push(singleEntry);
            count++;
          }
        }
      }

      //if 10 words found and pushed to words list
      if (count == 10) {
        break;
      }
    }
    this.isWordListAcquired = true;
    this.databaseProgress = "";
  }

  async getRandomWordsWordNet() {
    this.databaseProgress = "Working with Welsh WordNet. Please wait...\n";
    //null existing words
    this.words.length = 0;
    let count = 0;

    //count words in wordNet database
    var countResult;
    countResult = await this.countWords();
    let wordsCount = JSON.parse(JSON.stringify(countResult[0])).wordsCount;

    while(true) {
      //get a random word
      let randomWordResult = await this.findWordByArrayPosition(this.getRandomNumber(0, wordsCount));
      let randomWord = JSON.parse(JSON.stringify(randomWordResult[0])).word.k;

      //check if this word has synonyms
      let synonymList = await this.getSynonyms(randomWord);

      //if word has synonyms
      if (synonymList.length != 0) {
        let singleEntry = {
          "word": randomWord,
          "synonymList": synonymList,
          "inputWord": '',
          "result": ''
        }
        this.words.push(singleEntry);
        count++;
      }

      //if 10 words found and pushed to words list
      if (count == 10) {
        break;
      }
    }
    this.isWordListAcquired = true;
    this.databaseProgress = "";
  }

  getProgressValue(value: number) {
    return (this.words.length * 10);
  }


  submitButtonClick() {
    let correctWords = 0;
    this.gameResult = '';
    for (var w of this.words) {
      w.result = '';
    }

    //check the results against synonym lists
    for (var w of this.words) {
      //cycle through synonym list of a word
      for (var s of w.synonymList) {
        if(s == w.inputWord) {
          //match found
          w.result = 'check';
          correctWords++;
          break;
        }
      }
      //if result is wrong
      if (w.result != 'check') {
        w.result = 'close';
      }
    }

    this.gameResult = "You have scored " + correctWords + " out of 10.";
    this.gameResult2 = "You can check your answers now and resubmit or press NEW WORDS for a new round."
    this.isSubmitted = true;
    this.firstButtonText = "NEW WORDS";
    this.countdown.stop();
    this.timesUp = false;
  }

  translateClick(word): void {
    let url = "https://glosbe.com/cy/en/" + word;
    window.open(url, "_blank", "noopener");
  }

  async getSynonyms(word): Promise<String[]> {

    let synonymList = [];

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
        if(!synonymList.includes(w) && w != word) //check if a word is in the list already
        {
          synonymList.push(w);
        }
      }
    }

    return synonymList;
  }
  
  getRandomNumber(min, max): Number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
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

  //welshWords lists
  async countWordsWelshWords(level_welsh) {
    const count = await this.mongodbService.countWordsWelshWords(level_welsh).toPromise().catch(error => console.log(error));
    return count;
  }

  async getRandomWordFromDatabase(level_welsh) {
      let res = await this.mongodbService.getRandomWord(level_welsh).toPromise().catch(error => console.log(error));
      return res;
  }

}
