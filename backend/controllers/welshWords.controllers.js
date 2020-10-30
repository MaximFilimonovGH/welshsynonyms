const db = require("../models");
const mynediadCollection = db.mynediad_entry;
const sylfaenCollection = db.sylfaen_foundation;
const canolraddCollection = db.canolradd_intermediate;
const uwchCollection = db.uwch_advanced;

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
                "message": "No such level in database"
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

