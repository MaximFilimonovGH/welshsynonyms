module.exports = mongoose => {
    const wordsModel = mongoose.model(
        "words",
        mongoose.Schema(
            {
                "words": [{
                    "k": String,
                    "v": [String]
                }] 
            }
        )
    );
    
    return wordsModel;
}