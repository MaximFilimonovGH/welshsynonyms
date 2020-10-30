import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { MongodbService } from 'src/app/services/mongodb.service';

interface DifficultLevel {
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
    private mongodbService: MongodbService) { }

  @Input() data: any;

  isAnswerRequested = false;
  isSubmitted = false;
  isCorrect = false;
  isSynonymsAcquired = false;

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
  
  firstButtonText = "SKIP";
  randomWord = {
    "word": '',
    "synonymList": []
  };
  inputWord = '';
  answer = "";
  result = "";
  databaseProgress = "";
  submitProgress = "";

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

    this.firstButtonClick();
  }

  async firstButtonClick(): Promise<void> {
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
    this.databaseProgress = "";
    this.firstButtonText = "SKIP";

    this.databaseProgress = "Working with Welsh WordNet. Please wait...\n";

    //get random word from welshWords list based on difficulty
    await this.getRandomWord(this.selectedDifficultyWelsh.toLowerCase());

    //get random word from welsh word net with no regards to difficulty
    //await this.getRandomWordWordNet();

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
    if(this.inputWord == this.randomWord.word)
    {
      this.result = "Please input a different word";
      return;
    }

    //find word in mongodb
    let searchRes;
    searchRes = await this.findWord(this.inputWord);

    //if no such word
    if(searchRes.length == 0)
    {
      this.result = "There is no such word in Welsh WordNet";
      return;
    }

    //if word found
    for(var s of this.randomWord.synonymList)
    {
      if(s == this.inputWord)
      {
        this.result = "Correct!\n\nFull list of synonyms:\n" + this.randomWord.synonymList.toString().split(",").join('\n');;
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
    if (this.randomWord.synonymList.length == 0)
    {
      this.answer = "This word has no synonyms";
    }
    //print list of synonyms
    else
    {
      this.answer = this.randomWord.synonymList.toString().split(",").join('\n');
    }
  }

  translateClick(): void {
    let url = "https://glosbe.com/cy/en/" + this.randomWord;
    window.open(url, "_blank", "noopener");
  }

  async getRandomWord(level_welsh) {
    while (true) {
      let randomWord = await this.getRandomWordFromDatabase(level_welsh);
      //check if that word is in wordNet
      let wordNetCheck;
      wordNetCheck = await this.findWord(randomWord[0].word);
      if (wordNetCheck.length != 0) {
        //check if word has synonyms and form list of synonyms if any
        //check if this word has synonyms
        let synonymList;
        synonymList = await this.getSynonyms(randomWord[0].word);

        //if word has synonyms
        if (synonymList.length != 0) {
          this.randomWord = {
            "word": randomWord[0].word,
            "synonymList": synonymList,
          };
          break;
        }
      }
    }
  }

  async getRandomWordWordNet() {
    //count words in wordNet database
    var countResult;
    countResult = await this.countWords();
    let wordsCount = JSON.parse(JSON.stringify(countResult[0])).wordsCount;

    while (true) {
      //get random word from wordnet
      let randomWordResult = await this.findWordByArrayPosition(this.getRandomNumber(0, wordsCount));
      let randomWord = JSON.parse(JSON.stringify(randomWordResult[0])).word.k;

      //check if this word has synonyms
      let synonymList;
      synonymList = await this.getSynonyms(randomWord);

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

  async getSynonyms(word): Promise<String[]> {

    let synonymList = [];

    //find word and its synsets
    var wordFindResult;
    var synsetList;
    wordFindResult = await this.findWord(word);
    synsetList = JSON.parse(JSON.stringify(wordFindResult[0])).words[0].v;

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
