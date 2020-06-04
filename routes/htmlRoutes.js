var db = require("../models");

module.exports = function(app) {

// Routes
app.get("/", function(req, res) {
  db.Article.find({ saved:false })
  .then(function(data){
      var newData = []
      for(var i =0; i < data.length; i++){
          newData.push({
              _id: data[i]._id,
              saved: data[i].saved,
              headline: data[i].headline,
              summary: data[i].summary,
              link: data[i].link
          })
      }

      var hbsObject = {
          article: newData
      }
        res.render("index", hbsObject) 
      
      })
    })

 app.get("/saved", function(req,res){
     db.Article.find({ saved:true })
     .populate("notes")
     .then(function(data){
      var newData = []
      for(var i =0; i < data.length; i++){
          newData.push({
              _id: data[i]._id,
              saved: data[i].saved,
              headline: data[i].headline,
              summary: data[i].summary,
              link: data[i].link
          })
      }

      var hbsObject = {
          article: newData
      }
      console.log(hbsObject)
        res.render("saved", hbsObject) 

     })
 })
};