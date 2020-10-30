const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
    origin: "http://localhost:4202"
};

app.use(cors(corsOptions));

const db = require("./backend/models").dbWordNet;
db.mongoose
    .connect(db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Connected to the wordNet database");
    })
    .catch(err => {
        console.log("Cannot connect to the wordNet database", err);
        process.exit();
    });


//parse requests of content-type - application/json
app.use(bodyParser.json());

// Create link to Angular build directory
var distDir = "./dist/welshsynonyms/";
app.use(express.static(distDir));

//parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded( {extended: true }));

//simple route
app.get("/test", (req, res) => {
    res.json( {message: "Test backend app"});
});

//use routes
require("./backend/routes/routes")(app);

app.all("/*", function(req, res, next) {
    res.sendFile("index.html", { root: distDir });
});

//set port, listen for requests
const PORT = process.env.PORT || 8082;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});