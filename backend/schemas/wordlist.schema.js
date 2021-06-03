module.exports = mongoose => {
    const wordListSchema = mongoose.Schema({
        "eurfaEn": String,
        "pos": String,
        "eurfaCy": String
    },
    {
        collection: 'words'
    });
    
    return wordListSchema;
}