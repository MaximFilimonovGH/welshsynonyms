module.exports = mongoose => {
    const wordsSchema = mongoose.Schema({
        "word": String,
        "level_welsh": String,
        "level_english": String,
        "units": [String]
    },
    {
        collection: 'mynediad_entry'
    });
    
    return wordsSchema;
}