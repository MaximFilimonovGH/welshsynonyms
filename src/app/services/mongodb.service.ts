import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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

  public deleteAbstractById(pubmed_id) {
    this.findUrl = baseUrl + "abstracts/deleteById";


  }

  // new wordNet
  // find word
  public findWord(word) {
    this.findUrl = baseUrl + "wordNet/findWord";
    let headers = new HttpHeaders();
    let params = new HttpParams();
    params = params.set('word', word);
    return this.http.get(this.findUrl, {headers: headers, params: params});
  }

  public getSynonyms(word) {
    this.findUrl = baseUrl + "wordNet/getSynonyms";
    let headers = new HttpHeaders();
    let params = new HttpParams();
    params = params.set('word', word);
    return this.http.get(this.findUrl, {headers: headers, params: params});
  }

  public getSynonymsPos(word, pos) {
    this.findUrl = baseUrl + "wordNet/getSynonymsPos";
    let headers = new HttpHeaders();
    let params = new HttpParams();
    params = params.set('word', word);
    params = params.set('pos', pos);
    return this.http.get(this.findUrl, {headers: headers, params: params});
  }

  // new list of words
  public getRandomWordWordList(): Observable<any> {
    this.findUrl = baseUrl + "wordList/getRandomWord";
    let headers = new HttpHeaders();
    let params = new HttpParams();
    return this.http.get(this.findUrl, {headers: headers, params: params});
  }

  //welshWords datasets based on difficulty
  public countWordsWelshWordsDifficulty(level_welsh): Observable<any> {
    this.findUrl = baseUrl + "welshWords/countWords?level_welsh=" + level_welsh;
    return this.http.get(this.findUrl);
  }

  public getRandomWordDifficulty(level_welsh): Observable<any> {
    this.findUrl = baseUrl + "welshWords/getRandomWord?level_welsh="+ level_welsh;
    return this.http.get(this.findUrl);
  }
}
