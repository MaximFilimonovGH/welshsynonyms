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
models.wordsModel = connWordNet.model('words', require('./words.schema')(mongoose));
models.synsetModel = connWordNet.model('synsets', require('./synsets.schema')(mongoose));
models.mynediadModel = connWelshWords.model('mynediad_entry', require('./mynediad_entry.schema')(mongoose));
models.sylfaenModel = connWelshWords.model('sylfaen_foundation', require('./sylfaen_foundation.schema')(mongoose));
models.canolraddModel = connWelshWords.model('canolradd_intermediate', require('./canolradd_intermediate.schema')(mongoose));
models.uwchModel = connWelshWords.model('uwch_advanced', require('./uwch_advanced.schema')(mongoose));

module.exports = models;