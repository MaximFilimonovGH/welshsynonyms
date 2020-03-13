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
        return words;
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
      return synsets;
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
    .then((res) => {
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
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.error(err);
    })
  }

  


}
