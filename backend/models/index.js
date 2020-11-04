const dbConfig = require("../database/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.urlSynonymsGame;
db.words = require("./words.model.js")(mongoose);
db.synsets = require("./synsets.model.js")(mongoose);
db.mynediad_entry = require("./mynediad_entry.model.js")(mongoose);
db.sylfaen_foundation = require("./sylfaen_foundation.model.js")(mongoose);
db.canolradd_intermediate = require("./canolradd_intermediate.model.js")(mongoose);
db.uwch_advanced = require("./uwch_advanced.model.js")(mongoose);

module.exports = db;