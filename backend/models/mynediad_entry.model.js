module.exports = mongoose => {
    const wordsModel = mongoose.model(
        "mynediad_entry",
        mongoose.Schema(
            {
                "word": String,
                "level_welsh": String,
                "level_english": String,
                "units": [String]
            },
            {
                collection: 'mynediad_entry'
            }
        )
    );
    
    return wordsModel;
}