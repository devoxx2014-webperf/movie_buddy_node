/*=== Main Application ===*/
var args = process.argv.splice(2);
var express = require('express');


var movies = require('./db/movies.js');
var users = require('./db/users.js');

var rates = {};

var preco = require("./libs/euclidean");


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

app.get("/movies/search/title/:title/:limit", function(req, res) {
  res.send(movies.filter(function(movie) {
    return movie.Title.toLowerCase().search(new RegExp(req.params.title.toLowerCase()),"g") != -1;
  }).slice(0,req.params.limit));
});

app.get("/movies/search/actors/:actors/:limit", function(req, res) {
  res.send(movies.filter(function(movie) {
    return movie.Actors.toLowerCase().search(new RegExp(req.params.actors.toLowerCase()),"g") != -1;
  }).slice(0,req.params.limit));
});

app.get("/movies/search/genre/:genre/:limit", function(req, res) {
  res.send(movies.filter(function(movie) {
    return movie.Genre.toLowerCase().search(new RegExp(req.params.genre.toLowerCase()),"g") != -1;
  }).slice(0,req.params.limit));
});


app.get("/users", function(req, res) {
  res.send(users);
});

app.get("/users/:id", function(req, res) {
  res.send(users.filter(function(user) {
    return user._id == req.params.id;
  }));
});

app.get("/users/search/:name/:limit", function(req, res) {
  res.send(users.filter(function(user) {
    return user.name.toLowerCase().search(new RegExp(req.params.name.toLowerCase()),"g") != -1;
  }).slice(0,req.params.limit));
});

app.post("/rates", function(req, res) {

  var userRate = req.body;

  if(!rates[userRate.userId]) rates[userRate.userId] = {};
  rates[userRate.userId][userRate.movieId] = userRate.rate;

  res.statusCode = 201;
  res.header("location", "/rates/"+userRate.userId).end();
  //res.header("location", "/rates/"+userRate.userId).json(201, req.body);

});

//$.getJSON("rates/2164", function(data) { console.log(data); })
app.get("/rates/:userid1", function(req, res) {
  if (!rates[req.params.userid1]) rates[req.params.userid1] = [];
  res.json(200,rates[req.params.userid1]);
});


//$.getJSON("users/share/2164/452", function(data) { console.log(data); })
app.get("/users/share/:userid1/:userid2", function(req, res) {
  res.json(200, preco.sharedPreferences(rates, +req.params.userid1, +req.params.userid2));
});

//$.getJSON("users/distance/2164/452", function(data) { console.log(data); })
app.get("/users/distance/:userid1/:userid2", function(req, res) {
  res.json(200, preco.distance(rates, req.params.userid1, req.params.userid2));
});


app.listen(args[0] || 3000);
console.log("Listening on 3000")
