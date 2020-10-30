const dbConfig = require("../database/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const dbWordNet = {};
dbWordNet.mongoose = mongoose;
dbWordNet.url = dbConfig.urlWordNet;
dbWordNet.words = require("./words.model.js")(mongoose);
dbWordNet.synsets = require("./synsets.model.js")(mongoose);

const dbWelshWords = {};
dbWelshWords.mongoose = mongoose;
dbWelshWords.url = dbConfig.urlWelshWords;

module.exports = {
    dbWordNet,
    dbWelshWords
};