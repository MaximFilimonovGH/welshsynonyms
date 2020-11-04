// connection to single DB implementation
// const db = require("../models");
// const wordsCollection = db.words;

//connection to multiple databases
const wordsCollection = require("../schemas").wordsModel;

//retrieve a specified word from the database
exports.findWord = (req, res) => {
    const word = req.query.word;
    var condition = { "words.k": word };

    wordsCollection.find(condition).select( {"words.$": 1}).select( {"_id": 0} )
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

//Count words function
exports.countWordsOld = (req, res) => {
    wordsCollection.aggregate([
        {$project: {"_id": 0, wordsCount: {$size: "$words"} } }
    ])
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while counting words."
        });
    });
};

//Count words function
exports.countWords = async (req, res) => {
    try {
        var data = await wordsCollection.aggregate([
            {$project: {"_id": 0, wordsCount: {$size: "$words"} } }
        ])
        if (data)
            res.send(data);

    } catch (err) {
        res.status(500).send({
            message:
                err.message || "Some error occurred while counting words."
        });
    }
};

//Retrieve a word by its position in the words array
exports.getWordByPosition = (req, res) => {
    const arrNumber = req.query.number;
    wordsCollection.aggregate([
        {$project: {"_id": 0, word: { $arrayElemAt: ["$words", Number(arrNumber)] } } }
    ])
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving word by its array position."
        });
    });
}

