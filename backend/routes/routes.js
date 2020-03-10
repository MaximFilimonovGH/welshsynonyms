module.exports = app => {
    const words = require("../controllers/words.controller.js");
    const synsets = require("../controllers/synsets.controllers.js");

    var router = require("express").Router();

    //Retrieve a word
    router.get("/words", words.findWord);

    //Retrieve a synset
    router.get("/synsets", synsets.findSynset);

    app.use("/api", router);
}