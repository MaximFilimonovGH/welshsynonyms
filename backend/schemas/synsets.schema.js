module.exports = mongoose => {
    const synsetsSchema = mongoose.Schema({
        "sense": String,
        "pos": String,
        "lemma": [String]
    },
    {
        collection: 'synsets'
    });
    
    return synsetsSchema;
}