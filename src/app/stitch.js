const {
    Stitch,
    RemoteMongoClient,
    AnonymousCredential
} = require('mongodb-stitch-server-sdk');

const client = Stitch.initializeDefaultAppClient('welshwordnet-uvmng');

const db = client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas').db('wordNetWelsh');
const wordsCollection = db.collection("words");

const query = { "words.k": "ambiwlans" };
const options = {
    "projection": { "_id": 0, "words.$": 1}
};

wordsCollection.find( query, options ).toArray()
    .then((words) => {
        var stringified = JSON.stringify(words[0])
        console.log(JSON.stringify(words[0]));
        console.log(JSON.parse(stringified).words[0].v);
        
        client.close();
    })
    .catch((err) => {
        console.error(err);
        client.close();
    })

// client.auth.loginWithCredential(new AnonymousCredential())
//     .then(() =>
//     db.collection('words').find( { "words": "abostl" }, {"words.$": 1} )
//     ).then(docs => {
//         console.log("Found docs", docs);
//         console.log("[MongoDB Stitch] Connected to Stitch");
//         client.close();
//     }).catch(err => {
//         console.eroor(err);
//         client(close);
//     })