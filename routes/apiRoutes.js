var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");
var mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);
module.exports = function(app) {

// Routes
// A GET route for scraping the NYT website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://www.nytimes.com/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $("article h2").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.headline = $(this)
        .children("a")
        .text();
      result.URL = "https://www.nytimes.com/" + $(this)
        .children("a")
        .attr("href");

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
    });

    // Send a message to the client
    res.send("Scrape Complete");
  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving an Article
app.put("/articles/saved/:id", function(req, res) {
  db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Route for unsaving an Article
app.put("/articles/deleted/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: false, notes: []})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
  // Find one article using the req.params.id,
  db.Article.findOne({ _id: req.params.id })
    // and run the populate method with "note",
    .populate("note")
    // then responds with the article with the note included
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err)
    })
  });

  // Route for saving an Article's associated Note
  app.put("/notes/saved/:id", function (req, res) {
  // save the new note that gets posted to the Notes collection
  db.Note.create(req.body)
  .then(function(dbNote){
    return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { note: dbNote._id } }, { new: true })
    // then find an article from the req.params.id
    // and update it's "note" property with the _id of the new note
  })
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
  });
  
  
  // Delete an Article's associated Note
  app.delete("/notes/deleted/:id", function(req, res) {
    // Use the note id to find and delete it
    db.Note.findOneAndRemove({ _id: req.params.id })
        .then(function(dbNote){
        return db.Article.findOneAndUpdate({ _id: req.params.id }, {$pull: {note: dbNote._id}}, { new: true })
         // Resolve promise to execute query
        })
          .then(function(err) {
            // Log any errors
            if (err) {
              console.log(err);
              res.send(err);
            }
            else {
              // Or send the note to the browser
              res.send("Note Deleted");
            }
          });
      
    });
};