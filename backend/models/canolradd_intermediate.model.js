module.exports = mongoose => {
    const wordsModel = mongoose.model(
        "canolradd_intermediate",
        mongoose.Schema(
            {
                "word": String,
                "level_welsh": String,
                "level_english": String,
                "units": [String]
            },
            {
                collection: 'canolradd_intermediate'
            }
        )
    );
    
    return wordsModel;
}