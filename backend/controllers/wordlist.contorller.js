//connection collections
const collection = require("../schemas").wordListModel;

// retrieve all synsets
exports.findAll = (req, res) => {
    collection.find()
        .then(data => {
            console.log(`All data acquired`);
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || `Some error occured while retrieving data.`
            })
        })
}

// count all entries
exports.count = (req, res) => {
    collection.countDocuments()
        .then(data => {
            console.log(`There are ${data} entries in the database.`);
            // create JSON with result
            let count = {
                "count": data
            };
            res.send(count);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || `Some error occured while counting data.`
            })
        });
}