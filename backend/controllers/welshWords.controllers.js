//connection to multiple databases
const models = require('../schemas');
const mynediadCollection = models.mynediadModel;
const sylfaenCollection = models.sylfaenModel;
const canolraddCollection = models.canolraddModel;
const uwchCollection = models.uwchModel;

//Count words function
exports.countWords = async (req, res) => {
    try {
        const level_welsh = req.query.level_welsh;
        var data;
        if (level_welsh == "mynediad") {
            data = await mynediadCollection.countDocuments();
        }
        else if (level_welsh == "sylfaen") {
            data = await sylfaenCollection.countDocuments();
        }
        else if (level_welsh == "canolradd") {
            data = await canolraddCollection.countDocuments();
        }
        else if (level_welsh == "uwch") {
            data = await uwchCollection.countDocuments();
        }
        else {
            data = {
                "message": "Cannot find specified level in the database"
            };
        }
        if (data) {
            res.json(data);
        }

    } catch (err) {
        res.status(500).send({
            message:
                err.message || "Some error occurred while counting words."
        });
    }
};

exports.getRandomWord = async (req, res) => {
    try {
        const level_welsh = req.query.level_welsh;
        let data;
        if (level_welsh == "mynediad") {
            data = await mynediadCollection.aggregate([{ $sample: { size: 1 } }]);
        }
        else if (level_welsh == "sylfaen") {
            data = await sylfaenCollection.aggregate([{ $sample: { size: 1 } }]);
        }
        else if (level_welsh == "canolradd") {
            data = await canolraddCollection.aggregate([{ $sample: { size: 1 } }]);
        }
        else if (level_welsh == "uwch") {
            data = await uwchCollection.aggregate([{ $sample: { size: 1 } }]);
        }
        else {
            data = {
                "message": "Cannot find specified level in the database"
            };
        }
        res.json(data);
    } catch (err) {
        res.status(500).send({
            message:
                err.message || "Some error occurred while getting a word."
        });
    }
}

