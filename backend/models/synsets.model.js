module.exports = mongoose => {
    const synsetsModel = mongoose.model(
        "synsets",
        mongoose.Schema(
            {
                "synsets": [{
                    "k": String,
                    "v": [String]
                }] 
            }
        )
    );
    
    return synsetsModel;
}