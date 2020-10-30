module.exports = app => {
    const words = require("../controllers/words.controller.js");
    const synsets = require("../controllers/synsets.controllers.js");
    const welshWords = require("../controllers/welshWords.controllers.js");

    var router = require("express").Router();

    //Retrieve a word
    router.get("/words/findByWord", words.findWord);

    //Retrieve a synset
    router.get("/synsets/findBySynset", synsets.findSynset);

    //Count words
    router.get("/words/count", words.countWords);

    //Get word by array position
    router.get("/words/findByArrayPosition", words.getWordByPosition);

    //count words based on level in welshWords dataset
    router.get("/welshWords/countWords", welshWords.countWords);

    //get random word based on level in welshWords dataset
    router.get("/welshWords/getRandomWord", welshWords.getRandomWord);

    app.use("/", router);
}