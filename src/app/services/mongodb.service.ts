import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

const baseUrl = environment.baseApiUrl;
//const baseUrl = '/';

@Injectable({
  providedIn: 'root'
})
export class MongodbService {

  constructor(private http: HttpClient) { }

  findUrl = "";

  public findWord(word) {
    this.findUrl = baseUrl + "words/findByWord?word=" + word;
    return this.http.get(this.findUrl);
  }

  public findSynset(synset) {
    this.findUrl = baseUrl + "synsets/findBySynset?synset=" + synset;
    return this.http.get(this.findUrl);
  }

  public findWordByArrayPosition(arrNumber) {
    this.findUrl = baseUrl + "words/findByArrayPosition?number=" + arrNumber;
    return this.http.get(this.findUrl);
  }

  public countWords(): Observable<any> {
    this.findUrl = baseUrl + "words/count";
    return this.http.get(this.findUrl);
  }

  //welshWords datasets
  public countWordsWelshWords(level_welsh): Observable<any> {
    this.findUrl = baseUrl + "welshWords/countWords?level_welsh=" + level_welsh;
    return this.http.get(this.findUrl);
  }

  public getRandomWord(level_welsh): Observable<any> {
    this.findUrl = baseUrl + "welshWords/getRandomWord?level_welsh="+ level_welsh;
    return this.http.get(this.findUrl);
  }

}
