/*=== Main Application ===*/
var args = process.argv.splice(2);
var express = require('express');


var movies = require('./db/movies.js')


var app = express()

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded());


app.get("/movies", function(req, res) {
  res.send(movies);
});

app.get("/movies/:id", function(req, res) {
  res.send(movies.filter(function(movie) {
    return movie._id == req.params.id;
  }));
});

app.get("/movies/search/:title", function(req, res) {
  res.send(movies.filter(function(movie) {
    return movie.Title.toLowerCase().search(new RegExp(req.params.title.toLowerCase()),"g") != -1;
  }));
});



app.listen(args[0] || 3000);
console.log("Listening on 3000")