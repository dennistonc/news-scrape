var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var bodyParser = require('body-parser')
var exphbs = require("express-handlebars");
var dotenv = require('dotenv');

var db = require("./models");

var app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("/public"));
app.use(express.static("public/images"));
app.use(express.static("public/js"));
app.use(express.static("public/css"));

// Connect to the Mongo DB
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
// var MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://usernamegoeshere:passwordgoeshere@cluster-p4nz675l.1n4x6.mongodb.net/heroku_p4nz675l?retryWrites=true&w=majority";
dotenv.config()
mongoose.connect(process.env.MONGODB_URI);

// Handlebars
app.engine("handlebars",exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

var PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
