import { Injectable } from '@angular/core';
import { Stitch, RemoteMongoClient, AnonymousCredential } from 'mongodb-stitch-browser-sdk';

//import { Stitch } from 'mongodb-stitch';

@Injectable({
  providedIn: 'root'
})

export class MongodbStitchService {

  constructor() { }

  async findWord(word) {

    //Stitch.initializeDefaultAppClient("welshwordnet-uvmng");
    //const client = Stitch.defaultAppClient;
    const client = Stitch.initializeAppClient("welshwordnet-uvmng");
    const mongoClient = client.getServiceClient(RemoteMongoClient.factory, "mongodb-atlas");
    const wordsCollection = mongoClient.db("wordNetWelsh").collection("words");
    Stitch.clearApps();

    const query = { "words.k": word };
    const options = {
      "projection": { "_id": 0, "words.$": 1}
    }

    return wordsCollection.find( query, options ).toArray()
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
    const client = Stitch.initializeAppClient("welshwordnet-uvmng");
    const mongoClient = client.getServiceClient(RemoteMongoClient.factory, "mongodb-atlas");
    const synsetCollection = mongoClient.db("wordNetWelsh").collection("synsets");
    Stitch.clearApps();

    const query = { "synsets.k": synset };
    const options = {
      "projection": { "_id": 0, "synsets.$": 1}
    }

    return synsetCollection.find(query, options).toArray()
    .then((synsets) => {
      var result = JSON.parse(JSON.stringify(synsets[0]));
      return result;
    })
    .catch((err) => {
      console.error(err);
    })
  }

  async countWords() {
    const client = Stitch.initializeAppClient("welshwordnet-uvmng");
    const mongoClient = client.getServiceClient(RemoteMongoClient.factory, "mongodb-atlas");
    const wordsCollection = mongoClient.db("wordNetWelsh").collection("words");
    Stitch.clearApps();
    
    const pipeline = [{$project: {"_id": 0, wordsCount: {$size: "$words"} } }];

    return wordsCollection.aggregate(pipeline).toArray()
    .then((words) => {
      var res = JSON.parse(JSON.stringify(words[0]));
      return res;
    })
    .catch((err) => {
      console.error(err);
    })
  }

  async findWordByArrayPosition(arrNumber) {
    const client = Stitch.initializeAppClient("welshwordnet-uvmng");
    const mongoClient = client.getServiceClient(RemoteMongoClient.factory, "mongodb-atlas");
    const wordsCollection = mongoClient.db("wordNetWelsh").collection("words");
    Stitch.clearApps();

    const pipeline = [{$project: {"_id": 0, word: { $arrayElemAt: ["$words", Number(arrNumber)] } } }]

    return wordsCollection.aggregate(pipeline).toArray()
    .then((words) => {
      var res = JSON.parse(JSON.stringify(words[0]));
      return res;
    })
    .catch((err) => {
      console.error(err);
    })
  }

  


}
