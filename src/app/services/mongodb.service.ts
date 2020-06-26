import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

//const baseUrl = 'http://localhost:8082/'; //development ng serve URL
//const baseUrl = 'https://datainnovation.cardiff.ac.uk/api/welshsynonyms/' //production server URL
const baseUrl = environment.baseApiUrl;

@Injectable({
  providedIn: 'root'
})
export class MongodbService {

  constructor(private http: HttpClient) { }

  findUrl = "";

  findWord(word) {
    this.findUrl = baseUrl + "words/findByWord?word=" + word;
    return this.http.get(this.findUrl);
  }

  findSynset(synset) {
    this.findUrl = baseUrl + "synsets/findBySynset?synset=" + synset;
    return this.http.get(this.findUrl);
  }

  findWordByArrayPosition(arrNumber) {
    this.findUrl = baseUrl + "words/findByArrayPosition?number=" + arrNumber;
    return this.http.get(this.findUrl);
  }

  countWords(): Observable<any> {
    this.findUrl = baseUrl + "words/count";
    return this.http.get(this.findUrl);
  }





}
