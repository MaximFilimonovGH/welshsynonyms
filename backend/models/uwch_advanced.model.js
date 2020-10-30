module.exports = mongoose => {
    const wordsModel = mongoose.model(
        "uwch_advanced",
        mongoose.Schema(
            {
                "word": String,
                "level_welsh": String,
                "level_english": String,
                "units": [String]
            },
            {
                collection: 'uwch_advanced'
            }
        )
    );
    
    return wordsModel;
}