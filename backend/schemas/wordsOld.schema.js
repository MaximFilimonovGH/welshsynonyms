module.exports = mongoose => {
    const wordsSchema = mongoose.Schema({
        "words": [{
            "k": String,
            "v": [String]
        }] 
    },
    {
        collection: 'wordsOld'
    });
    
    return wordsSchema;
}