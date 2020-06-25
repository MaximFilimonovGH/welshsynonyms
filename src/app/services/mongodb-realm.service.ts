import { Injectable } from '@angular/core';

import * as RealmWeb from 'realm-web';
import { assert } from 'console';

@Injectable({
  providedIn: 'root'
})
export class MongodbRealmService {

  constructor() { }

  async countWords() {
    const app: RealmWeb.App = new RealmWeb.App({ id: "welshwordnet-uvmng" });
    const credentials = RealmWeb.Credentials.anonymous();
    // Authenticate the user
    const user: RealmWeb.User = await app.logIn(credentials);

    const mongoClient = app.services.mongodb("mongodb-atlas");
    const wordsCollection = mongoClient.db("wordNetWelsh").collection("words");
    
    const pipeline = [{$project: {"_id": 0, wordsCount: {$size: "$words"} } }];

    return wordsCollection.aggregate(pipeline)
    .then((words) => {
      var res = JSON.parse(JSON.stringify(words[0]));
      return res;
    })
    .catch((err) => {
      console.error(err);
    })
  }

  async findWordByArrayPosition(arrNumber) {
    const app: RealmWeb.App = new RealmWeb.App({ id: "welshwordnet-uvmng" });
    const credentials = RealmWeb.Credentials.anonymous();
    // Authenticate the user
    const user: RealmWeb.User = await app.logIn(credentials);

    const mongoClient = app.services.mongodb("mongodb-atlas");
    const wordsCollection = mongoClient.db("wordNetWelsh").collection("words");

    const pipeline = [{$project: {"_id": 0, word: { $arrayElemAt: ["$words", Number(arrNumber)] } } }]

    return wordsCollection.aggregate(pipeline)
    .then((words) => {
      var res = JSON.parse(JSON.stringify(words[0]));
      return res;
    })
    .catch((err) => {
      console.error(err);
    })
  }

  async findWord(word) {  

    const app: RealmWeb.App = new RealmWeb.App({ id: "welshwordnet-uvmng" });
    const credentials = RealmWeb.Credentials.anonymous();
    // Authenticate the user
    const user: RealmWeb.User = await app.logIn(credentials);

    const mongoClient = app.services.mongodb("mongodb-atlas");
    const wordsCollection = mongoClient.db("wordNetWelsh").collection("words");

    const query = { "words.k": word };
    const options = {
      "projection": { "_id": 0, "words.$": 1}
    }

    return wordsCollection.find( query, options )
    .then((words) => {
      //console.log("words: ", words);
      if(words.length == 0)
      {
        return words;
      }
      else
      {
        var result = JSON.parse(JSON.stringify(words[0]));
        return result;
      }

    })
    .catch((err) => {
        console.error(err);
    })

  }

  async findSynset(synset) {
    const app: RealmWeb.App = new RealmWeb.App({ id: "welshwordnet-uvmng" });
    const credentials = RealmWeb.Credentials.anonymous();
    // Authenticate the user
    const user: RealmWeb.User = await app.logIn(credentials);

    const mongoClient = app.services.mongodb("mongodb-atlas");
    const synsetCollection = mongoClient.db("wordNetWelsh").collection("synsets");

    const query = { "synsets.k": synset };
    const options = {
      "projection": { "_id": 0, "synsets.$": 1}
    }

    return synsetCollection.find(query, options)
    .then((synsets) => {
      var result = JSON.parse(JSON.stringify(synsets[0]));
      return result;
    })
    .catch((err) => {
      console.error(err);
    })
  }

}
