import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { MongodbService } from 'src/app/services/mongodb.service';

interface DifficultyLevel {
  id: number;
  level_english: string;
  level_welsh: string;
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  constructor(private router: Router,
    private mongodbService: MongodbService) {}

  @Input() data: any;

  @Output() onResetRequested: EventEmitter<any> = new EventEmitter<any>();

  isAnswerRequested = false;
  isSubmitted = false;
  isCorrect = false;
  isSynonymsAcquired = false;

  isWelsh;

  selectedDifficultyId;
  selectedDifficulty;
  difficultyLevels: DifficultyLevel[];
  difSliderMax;
  difSliderMin;
  difSliderTick;
  lowestDifficulty;
  hardestDifficulty;
  
  randomWord = {
    "word": '',
    "synonymList": []
  };
  inputWord = '';
  answer = "";
  result = "";
  databaseProgress = "";
  submitProgress = "";

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

    // check if Welsh and assign view values for difficulty and gamevariant (test/practice)

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

    this.startButtonClick();
  }

  async startButtonClick(): Promise<void> {
    this.isAnswerRequested = false;
    this.isSubmitted = false;
    this.isCorrect = false;
    this.isSynonymsAcquired = false;
    this.inputWord = "";
    this.randomWord = {
      "word": '',
      "synonymList": []
    };
    this.answer = "";
    this.result = "";

    if (this.isWelsh) {
      this.databaseProgress = "Yn gweithio gyda WordNet Cymraeg. Arhoswch os gwelwch yn dda...\n";
    } else {
      this.databaseProgress = "Working with Welsh WordNet. Please wait...\n";
    }

    // get random word from new list of words
    await this.getRandomWordWordList();

    //get random word from welshWords list based on difficulty
    //await this.getRandomWordDifficulty(this.selectedDifficultyId);

    //get random word from old welsh word net with no regards to difficulty
    //await this.getRandomWordWordNetOld();

    this.databaseProgress = "";
    this.isSynonymsAcquired = true;
  }

  async submitButtonClick(): Promise<void> {
    this.isSubmitted = true;
    this.isAnswerRequested = false;
    this.isCorrect = false;
    if (this.isWelsh) {
      this.result = "Gwirio...";
    } else {
      this.result = "Checking...";
    }
    
    //if no input
    if(this.inputWord.length == 0)
    {
      if (this.isWelsh) {
        this.result = "Rhowch air";
      } else {
        this.result = "Please input a word";
      }
      return;
    }

    this.inputWord = this.inputWord.toLowerCase();

    //if same word 
    if(this.inputWord == this.randomWord.word)
    {
      if (this.isWelsh) {
        this.result = "Rhowch air gwahanol os gwelwch yn dda";
      } else {
        this.result = "Please input a different word";
      }
      return;
    }

    //find word in mongodb
    let searchRes;
    searchRes = await this.findWord(this.inputWord);

    //if no such word
    if(searchRes.length == 0)
    {
      if (this.isWelsh) {
        this.result = "Nid oes y fath air yn Cymraeg WordNet";
      } else {
        this.result = "There is no such word in Welsh WordNet";
      }
      return;
    }

    //if word found
    for(var s of this.randomWord.synonymList)
    {
      if(s == this.inputWord)
      {
        if (this.isWelsh) {
          this.result = "Cywir!\n\nRhestr lawn o gyfystyron:\n" + this.randomWord.synonymList.toString().split(",").join('\n');
        } else {
          this.result = "Correct!\n\nFull list of synonyms:\n" + this.randomWord.synonymList.toString().split(",").join('\n');
        }
        this.isCorrect = true;
        return;
      }
    }
    if (this.isWelsh) {
      this.result = "Anghywir.\n\nCeisiwch air gwahanol neu cliciwch AWGRYM i weld y cyfystyron.";
    } else {
      this.result = "Incorrect.\n\nPlease try a different word or press HINT to see the synonyms.";
    }
  }

  showAnswerClick(): void {
    this.isAnswerRequested = true;
    this.isSubmitted = false;

    //if no synonyms for this word
    if (this.randomWord.synonymList.length == 0)
    {
      if (this.isWelsh) {
        this.answer = "Nid oes gan y gair hwn gyfystyron";
      } else {
        this.answer = "This word has no synonyms";
      }
    }
    //print list of synonyms
    else
    {
      this.answer = this.randomWord.synonymList.toString().split(",").join('\n');
    }
  }

  translateClick(): void {
    let url = "https://glosbe.com/cy/en/" + this.randomWord.word;
    window.open(url, "_blank", "noopener");
  }

  backButtonClick(data: boolean): void {
    this.onResetRequested.emit(data);
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

  async getRandomWordWordList() {
    while (true) {
      //get a random word
      let randomWordResult = await this.getRandomWordFromDatabaseWordList();
      let randomWord = randomWordResult[0].eurfaCy;
      let randomWordPos = randomWordResult[0].pos;
      //check if that word is in wordNet
      let wordNetCheck;
      wordNetCheck = await this.findWord(randomWord);
      if (wordNetCheck.length != 0) {
        //check if word has synonyms and form list of synonyms if any
        //check if this word has synonyms
        let synonymList;
        synonymList = await this.getSynonymsWordNetPos(randomWord, randomWordPos);
        //if word has synonyms
        if (synonymList.length != 0) {
          this.randomWord = {
            "word": randomWord,
            "synonymList": synonymList,
          };
          break;
        }
      }
    }
  }

  async getRandomWordDifficulty(difficultyId) {
    var level_welsh;
    // get difficulty level in Welsh
    for (let i = 0; i < this.difficultyLevels.length; i++) {
      if (this.difficultyLevels[i].id == difficultyId) {
        level_welsh = this.difficultyLevels[i].level_welsh.toLowerCase();
        break;
      }
    }
    while (true) {
      //get a random word
      let randomWordResult = await this.getRandomWordFromDatabaseDifficulty(level_welsh);
      let randomWord = randomWordResult[0].word
      //check if that word is in wordNet
      let wordNetCheck;
      wordNetCheck = await this.findWord(randomWord);
      if (wordNetCheck.length != 0) {
        //check if word has synonyms and form list of synonyms if any
        //check if this word has synonyms
        let synonymList;
        synonymList = await this.getSynonymsWordNet(randomWord);

        //if word has synonyms
        if (synonymList.length != 0) {
          this.randomWord = {
            "word": randomWord,
            "synonymList": synonymList,
          };
          break;
        }
      }
    }
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


  // old wordNet
  async getRandomWordWordNetOld() {
    //count words in wordNet database
    var countResult;
    countResult = await this.countWordsOld();
    let wordsCount = JSON.parse(JSON.stringify(countResult[0])).wordsCount;

    while (true) {
      //get random word from wordnet
      let randomWordResult = await this.findWordByArrayPositionOld(this.getRandomNumber(0, wordsCount));
      let randomWord = JSON.parse(JSON.stringify(randomWordResult[0])).word.k;

      //check if this word has synonyms
      let synonymList;
      synonymList = await this.getSynonymsOld(randomWord);

      //if word has synonyms
      if (synonymList.length != 0) {
        this.randomWord = {
          "word": randomWord,
          "synonymList": synonymList,
        };
        break;
      }
    }
  }

  async getSynonymsOld(word): Promise<String[]> {

    let synonymList = [];

    //find word and its synsets
    var wordFindResult;
    var synsetList;
    wordFindResult = await this.findWordOld(word);
    synsetList = JSON.parse(JSON.stringify(wordFindResult[0])).words[0].v;

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

  // old wordNet
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
