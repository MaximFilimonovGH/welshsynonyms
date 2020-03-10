const db = require("../models");
const wordsCollection = db.words;

//retrieve a specified word from the database
exports.findWord = (req, res) => {
    const word = req.query.word;
    var condition = { "words.k": word };

    wordsCollection.find(condition).select( {"words.$": 1})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving word."
            });
        });
};

