module.exports = mongoose => {
    const wordsSchema = mongoose.Schema({
        "words": [{
            "k": String,
            "v": [String]
        }] 
    });
    
    return wordsSchema;
}