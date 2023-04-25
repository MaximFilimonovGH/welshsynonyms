module.exports = app => {

    var router = require("express").Router();

    // new wordlist
    const wordList = require('../controllers/wordlist.controller.js');
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
    // get synonyms
    router.get('/wordNet/getSynonyms', wordNet.getSynonyms);
    // get synonyms pos
    router.get('/wordNet/getSynonymsPos', wordNet.getSynonymsPos);
    // find word
    router.get('/wordNet/findWord', wordNet.findWord);

    // difficulty lists
    const welshWords = require("../controllers/welshWords.controllers.js");
    //count words based on level in welshWords dataset
    router.get("/welshWords/countWords", welshWords.countWords);
    //get random word based on level in welshWords dataset
    router.get("/welshWords/getRandomWord", welshWords.getRandomWord);

    app.use("/", router);
}