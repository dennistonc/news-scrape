var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var exphbs = require("express-handlebars");

var db = require("./models");

var app = express();

// Configure middleware
// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("/public"));

// Connect to the Mongo DB
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/news-scrape";
mongoose.connect(MONGODB_URI);

app.engine("handlebars",exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

var PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
