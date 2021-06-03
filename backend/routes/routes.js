module.exports = app => {

    var router = require("express").Router();

    // new wordlist
    const wordList = require('../controllers/wordlist.contorller.js');
    // get all words from wordList
    router.get('/wordList/all', wordList.findAll);
    // count words in wordList
    router.get('/wordList/count', wordList.count);
    // get a random word
    router.get('/wordList/getRandomWord', wordList.getRandomWord);

    // new wordNet Synsets
    const wordNet = require('../controllers/synsets.controller');
    // get all synsets
    router.get('/wordNet/all', wordNet.findAll);
    // count synsets
    router.get('/wordNet/count', wordNet.count);

    // difficulty lists
    const welshWords = require("../controllers/welshWords.controllers.js");
    //count words based on level in welshWords dataset
    router.get("/welshWords/countWords", welshWords.countWords);
    //get random word based on level in welshWords dataset
    router.get("/welshWords/getRandomWord", welshWords.getRandomWord);

    // old wordNet
    const wordsOld = require("../controllers/wordsOld.controller.js");
    const synsetsOld = require("../controllers/synsetsOld.controllers.js");
    //Retrieve a word
    router.get("/wordsOld/findByWord", wordsOld.findWord);
    //Retrieve a synset
    router.get("/synsetsOld/findBySynset", synsetsOld.findSynset);
    //Count words
    router.get("/wordsOld/count", wordsOld.countWords);
    //Get word by array position
    router.get("/wordsOld/findByArrayPosition", wordsOld.getWordByPosition);

    app.use("/", router);
}