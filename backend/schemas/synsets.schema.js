module.exports = mongoose => {
    const synsetsSchema = mongoose.Schema({
        "synsets": [{
            "k": String,
            "v": [String]
        }] 
    });
    
    return synsetsSchema;
}