//connection collections
const collection = require("../schemas").synsetsModel;

// get word synonyms
exports.getSynonyms = async (req, res) => {
    // check if the word and pos parameters are provided
    if (!req.query.word && !req.query.pos) {
        res.status(400).send({ message: "word or pos cannot be empty!"});
        return;
    }

    try {
        let synonyms = [];
        // get the synsets that word belongs to
        let condition = { "lemma": req.query.word, "pos": req.query.pos }
        let data = await collection.find(condition);
        if (data.length == 0) {
            res.send(synonyms);
            return;
        }

        // cycle through results and eliminate huge block of data
        for (let i = 0; i < data.length; i++) {
            // skip huge block of data
            if (data[i].lemma.length > 30) {
                continue;
            } 
            // push all other words
            else {
                for (let j = 0; j < data[i].lemma.length; j++) {
                    synonyms.push(data[i].lemma[j]);
                }
            }
        }
        res.send(synonyms);
    } catch(err) {
        res.status(500).send({
            message:
                err.message || "Some error occurred while getting synonyms"
        });
    }
}

// find word in wordnet
exports.findWord = (req, res) => {
    // check if the word parameters are provided
    if (!req.query.word) {
        res.status(400).send({ message: "word cannot be empty!"});
        return;
    }

    let condition = { "lemma": req.query.word };
    collection.find(condition)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || `Some error occured while retrieving synsets data.`
            })
        })
}

// retrieve all synsets
exports.findAll = (req, res) => {
    collection.find()
        .then(data => {
            console.log(`All synsets data acquired`);
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || `Some error occured while retrieving synsets data.`
            })
        })
}

// count all entries
exports.count = (req, res) => {
    collection.countDocuments()
        .then(data => {
            console.log(`There are ${data} synsets in the database.`);
            // create JSON with result
            let count = {
                "count": data
            };
            res.send(count);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || `Some error occured while counting synsets data.`
            })
        });
}