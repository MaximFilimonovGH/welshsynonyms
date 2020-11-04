// connection to single DB implementation
//const db = require("../models");
//const synsetsCollection = db.synsets;

//connection to multiple databases
const synsetsCollection = require("../schemas").synsetModel;

//retrieve a specified word from the database
exports.findSynset = (req, res) => {
    const synset = req.query.synset;
    var condition = { "synsets.k": synset };

    synsetsCollection.find(condition).select( {"synsets.$": 1}).select( {"_id": 0} )
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

