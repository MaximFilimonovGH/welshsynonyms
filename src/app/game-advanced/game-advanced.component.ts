import { Component, OnInit, Input } from '@angular/core';

import { MongodbService } from 'src/app/services/mongodb.service';
import { MatDialog } from '@angular/material/dialog';

import { HintDialogComponent } from 'src/app/game-advanced/hint-dialog/hint-dialog.component';

interface DifficultLevel {
  id: number;
  viewValue: string;
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

  isSubmitted = false;
  isWordListAcquired = false;
  firstButtonText = "NEW WORDS";
  databaseProgress = '';
  gameResult = '';
  gameResult2 = '';
  selectedDifficultyId;
  difficultyLevels: DifficultLevel[];

  words = [];
  wordsCount = 0;

  async ngOnInit(): Promise<void> {
    this.selectedDifficultyId = this.data.selectedDifficultyId;
    this.difficultyLevels = this.data.difficultyLevels;
    //count words in wordNet database
    var countResult;
    countResult = await this.countWords();
    this.wordsCount = JSON.parse(JSON.stringify(countResult[0])).wordsCount;
    await this.getRandomWords();
  }

  async startButtonClick() {
    this.isWordListAcquired = false;
    this.isSubmitted = false;
  
    await this.getRandomWords();
  }

  showHintClick(wordData) {
    const dialogRef = this.dialog.open(HintDialogComponent, {
       data: wordData,
       autoFocus: false
    });
  }

  async getRandomWords() {
    this.databaseProgress = "Working with Welsh WordNet. Please wait...\n";
    //null existing words
    this.words.length = 0;
    let count = 0;

    while(true) {
      //get a random word
      let randomWordResult = await this.findWordByArrayPosition(this.getRandomNumber(0, this.wordsCount));
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
