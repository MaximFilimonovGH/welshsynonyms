const dbConfig = require("../database/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

const connWelshWords = mongoose.createConnection(dbConfig.urlWelshWords, options);
const connWordNet = mongoose.createConnection(dbConfig.urlWordNet, options);

const models = {};

// new wordNet model
models.synsetsModel = connWordNet.model('synsets', require('./synsets.schema')(mongoose));

// new wordList model for random words
models.wordListModel = connWelshWords.model('wordList', require('./wordlist.schema')(mongoose));

// difficulty lists models
models.mynediadModel = connWelshWords.model('mynediad_entry', require('./mynediad_entry.schema')(mongoose));
models.sylfaenModel = connWelshWords.model('sylfaen_foundation', require('./sylfaen_foundation.schema')(mongoose));
models.canolraddModel = connWelshWords.model('canolradd_intermediate', require('./canolradd_intermediate.schema')(mongoose));
models.uwchModel = connWelshWords.model('uwch_advanced', require('./uwch_advanced.schema')(mongoose));

module.exports = models;