module.exports = mongoose => {
    const wordsModel = mongoose.model(
        "sylfaen_foundation",
        mongoose.Schema(
            {
                "word": String,
                "level_welsh": String,
                "level_english": String,
                "units": [String]
            },
            {
                collection: 'sylfaen_foundation'
            }
        )
    );
    
    return wordsModel;
}