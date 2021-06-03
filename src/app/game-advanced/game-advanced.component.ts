import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';

import { MongodbService } from 'src/app/services/mongodb.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { HintDialogComponent } from 'src/app/game-advanced/hint-dialog/hint-dialog.component';
import { CountdownComponent } from 'ngx-countdown';

interface DifficultyLevel {
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
  databaseProgress = '';
  gameResult = '';
  gameResult2 = '';

  isWelsh;

  selectedDifficultyId;
  selectedDifficulty;
  difficultyLevels: DifficultyLevel[];
  difSliderMax;
  difSliderMin;
  difSliderTick;
  lowestDifficulty;
  hardestDifficulty;

  timeLimit;
  questionsNumber;

  words = [];

  countdownConfig = {
    leftTime: 90,
    stopTime: 0,
    format: 'm:s.S'
  };
  timesUp = false;

  submitButtonText;
  nextButtonText;
  exitButtonText;
  difficultyText;
  questionText;
  translateButtonText;
  answerText;
  synonymLabelText;
  hintButtonText;
  listOfSynonymsText;
  resultText;
  timeRemainingText;

  async ngOnInit(): Promise<void> {

    //get data from main component regarding difficulty settings
    this.isWelsh = this.data.isWelsh;
    this.selectedDifficultyId = this.data.selectedDifficultyId;
    this.difficultyLevels = this.data.difficultyLevels;
    this.difSliderMax = this.data.difficultySliderSettings.difSliderMax;
    this.difSliderMin = this.data.difficultySliderSettings.difSliderMin;
    this.difSliderTick = this.data.difficultySliderSettings.difSliderTick;
    // get data on language
    this.submitButtonText = this.data.languageSettings.submitButtonText;
    this.nextButtonText = this.data.languageSettings.nextButtonText;
    this.exitButtonText = this.data.languageSettings.exitButtonText;
    this.difficultyText = this.data.languageSettings.difficultyText;
    this.questionText = this.data.languageSettings.questionText;
    this.translateButtonText = this.data.languageSettings.translateButtonText;
    this.answerText = this.data.languageSettings.answerText;
    this.synonymLabelText = this.data.languageSettings.synonymLabelText;
    this.hintButtonText = this.data.languageSettings.hintButtonText;
    this.listOfSynonymsText = this.data.languageSettings.listOfSynonymsText;
    this.resultText = this.data.languageSettings.resultText;
    this.timeRemainingText = this.data.languageSettings.timeRemainingText;

    if (this.isWelsh) {
      this.lowestDifficulty = this.difficultyLevels[0].level_welsh;
      this.hardestDifficulty = this.difficultyLevels[this.difficultyLevels.length-1].level_welsh;
      for (let i = 0; i < this.difficultyLevels.length; i++) {
        if (this.difficultyLevels[i].id == this.selectedDifficultyId) {
          this.selectedDifficulty = this.difficultyLevels[i].level_welsh;
          break;
        }
      }
    }
    else {
      this.lowestDifficulty = this.difficultyLevels[0].level_english;
      this.hardestDifficulty = this.difficultyLevels[this.difficultyLevels.length-1].level_english;
      for (let i = 0; i < this.difficultyLevels.length; i++) {
        if (this.difficultyLevels[i].id == this.selectedDifficultyId) {
          this.selectedDifficulty = this.difficultyLevels[i].level_english;
          break;
        }
      }
    }

    this.questionsNumber = this.data.questionsNumber;
    this.timeLimit = this.data.timeLimit;
    this.countdownConfig.leftTime = this.timeLimit * 60;

    this.startButtonClick();
  }

  async startButtonClick() {
    this.timesUp = false;
    this.gameResult = '';
    this.gameResult2 = '';
    this.databaseProgress = '';
    this.isWordListAcquired = false;
    this.isSubmitted = false;

    // get words from new list of words disregarding difficulty
    await this.getRandomWordsWordList(this.questionsNumber);
  
    // get words from welshWords lists
    // await this.getRandomWordsDifficulty(this.selectedDifficultyId, this.questionsNumber);

    //get words from wordNet disregarding difficulty
    //await this.getRandomWordsWordNet(this.questionsNumber);

    //this.countdown.begin();
  }

  // random words based on difficulty and new wordnet
  async getRandomWordsWordList(number) {
    if (this.isWelsh) {
      this.databaseProgress = "Yn gweithio gyda WordNet Cymraeg. Arhoswch os gwelwch yn dda...\n";
    } else {
      this.databaseProgress = "Working with Welsh WordNet. Please wait...\n";
    }
    //null existing words
    this.words.length = 0;
    let count = 0;

    while(true) {
      //get a random word
      let randomWordResult = await this.getRandomWordFromDatabaseWordList();
      let randomWord = randomWordResult[0].eurfaCy
      let randomWordPos = randomWordResult[0].pos
      //check if this word is in wordNet
      let wordNetCheck;
      wordNetCheck = await this.findWord(randomWord);
      //if word is in wordNet
      if (wordNetCheck.length != 0) {
        //check if this word has synonyms
        let synonymList;
        synonymList = await this.getSynonymsWordNetPos(randomWord, randomWordPos);

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
      if (count == number) {
        break;
      }
    }
    this.isWordListAcquired = true;
    this.databaseProgress = "";
  }

  // random words based on difficulty and new wordnet
  async getRandomWordsDifficulty(difficultyId, number) {
    if (this.isWelsh) {
      this.databaseProgress = "Yn gweithio gyda WordNet Cymraeg. Arhoswch os gwelwch yn dda...\n";
    } else {
      this.databaseProgress = "Working with Welsh WordNet. Please wait...\n";
    }
    //null existing words
    this.words.length = 0;
    let count = 0;

    var level_welsh;
    // get difficulty level in Welsh
    for (let i = 0; i < this.difficultyLevels.length; i++) {
      if (this.difficultyLevels[i].id == difficultyId) {
        level_welsh = this.difficultyLevels[i].level_welsh.toLowerCase();
        break;
      }
    }

    while(true) {
      //get a random word
      let randomWordResult = await this.getRandomWordFromDatabaseDifficulty(level_welsh);
      let randomWord = randomWordResult[0].word
      //check if this word is in wordNet
      let wordNetCheck;
      wordNetCheck = await this.findWord(randomWord);
      //if word is in wordNet
      if (wordNetCheck.length != 0) {
        //check if this word has synonyms
        let synonymList;
        synonymList = await this.getSynonymsWordNet(randomWord);

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
      if (count == number) {
        break;
      }
    }
    this.isWordListAcquired = true;
    this.databaseProgress = "";
  }

  // new wordNet
  // find word
  async findWord(word) {
    const result = await this.mongodbService.findWord(word).toPromise().catch(error => console.log(error));
    return result;
  }

  // get synonyms
  async getSynonymsWordNet(word) {
    const result = await this.mongodbService.getSynonyms(word).toPromise().catch(error => console.log(error));
    return result;
  }

  // get synonyms
  async getSynonymsWordNetPos(word, pos) {
    const result = await this.mongodbService.getSynonymsPos(word, pos).toPromise().catch(error => console.log(error));
    return result;
  }

  // new list of words
  async getRandomWordFromDatabaseWordList() {
    const result = await this.mongodbService.getRandomWordWordList().toPromise().catch(error => console.log(error));
    return result;
  }

  //welshWords lists
  async countWordsWelshWordsDifficulty(level_welsh) {
    const count = await this.mongodbService.countWordsWelshWordsDifficulty(level_welsh).toPromise().catch(error => console.log(error));
    return count;
  }

  async getRandomWordFromDatabaseDifficulty(level_welsh) {
      let res = await this.mongodbService.getRandomWordDifficulty(level_welsh).toPromise().catch(error => console.log(error));
      return res;
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

    if (this.isWelsh) {
      this.gameResult = `Rydych chi wedi sgorio ${correctWords} allan o ${this.questionsNumber}.`
    } else {
      this.gameResult = `You have scored ${correctWords} out of ${this.questionsNumber}.`
    }

    //"You have scored " + correctWords + " out of ";
    //this.gameResult2 = "You can check your answers now and resubmit or press NEXT ROUND."
    this.isSubmitted = true;
    this.countdown.stop();
    this.timesUp = false;
  }

  translateClick(word): void {
    let url = "https://glosbe.com/cy/en/" + word;
    window.open(url, "_blank", "noopener");
  }
  
  getRandomNumber(min, max): Number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
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

  handleCountdownEvent($event) {
    if ($event.action == "done") {
      this.timesUp = true;
      if (this.isWelsh) {
        this.gameResult = "Amser ar ben! Cyflwynwch eich atebion.";
      } else {
        this.gameResult = "Time is up! Please submit your answers.";
      }
    }
  }

  backButtonClick(data: boolean): void {
    this.onResetRequested.emit(data);
  }

  showHintClick(event, wordData) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.position = {
      'top': event.y + 'px'
    };
    dialogConfig.data = wordData;
    dialogConfig.data.isWelsh = this.isWelsh;
    const dialogRef = this.dialog.open(HintDialogComponent, dialogConfig);
  }

  getProgressValue(value: number) {
    return ((this.words.length / this.questionsNumber) * 100);
  }

  // old Word Net functions
  async getRandomWordsWordNetOld(number) {
    if (this.isWelsh) {
      this.databaseProgress = "Yn gweithio gyda WordNet Cymraeg. Arhoswch os gwelwch yn dda...\n";
    } else {
      this.databaseProgress = "Working with Welsh WordNet. Please wait...\n";
    }
    //null existing words
    this.words.length = 0;
    let count = 0;

    //count words in wordNet database
    var countResult;
    countResult = await this.countWordsOld();
    let wordsCount = JSON.parse(JSON.stringify(countResult[0])).wordsCount;

    while(true) {
      //get a random word
      let randomWordResult = await this.findWordByArrayPositionOld(this.getRandomNumber(0, wordsCount));
      let randomWord = JSON.parse(JSON.stringify(randomWordResult[0])).word.k;

      //check if this word has synonyms
      let synonymList = await this.getSynonymsOld(randomWord);

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
      if (count == number) {
        break;
      }
    }
    this.isWordListAcquired = true;
    this.databaseProgress = "";
  }

  async getSynonymsOld(word): Promise<String[]> {

    let synonymList = [];

    //find word and its synsets
    var wordFindResult;
    var synsetList;
    wordFindResult = await this.findWordOld(word);
    synsetList = JSON.parse(JSON.stringify(wordFindResult[0])).words[0].v;
    //console.log("Synset List: ", synsetList);

    for (var s of synsetList)     //cycle all synsets
    {
       //find each synset in mongodb
      var synsetFindRes;
      var wordsList;
      synsetFindRes = await this.findSynsetOld(s);
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

  // old wordNet service functions
  async countWordsOld() {
    const count = await this.mongodbService.countWordsOld().toPromise().catch(error => console.log(error));
    return count;
  }

  async findWordByArrayPositionOld(arrNumber) {
    const result = await this.mongodbService.findWordByArrayPositionOld(arrNumber).toPromise().catch(error => console.log(error));
    return result;
  }

  async findWordOld(word) {
    const result = await this.mongodbService.findWordOld(word).toPromise().catch(error => console.log(error));
    return result;
  }

  async findSynsetOld(synset) {
    const result = await this.mongodbService.findSynsetOld(synset).toPromise().catch(error => console.log(error));
    return result;
  }
}
