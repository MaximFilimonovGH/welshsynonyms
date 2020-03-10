module.exports = app => {
    const words = require("../controllers/words.controller.js");
    const synsets = require("../controllers/synsets.controllers.js");

    var router = require("express").Router();

    //Retrieve a word
    router.get("/words/findByWord", words.findWord);

    //Retrieve a synset
    router.get("/synsets/findBySynset", synsets.findSynset);

    //Count words
    router.get("/words/count", words.countWords);

    //Get word by array position
    router.get("/words/findByArrayPosition", words.getWordByPosition);

    app.use("/api", router);
}