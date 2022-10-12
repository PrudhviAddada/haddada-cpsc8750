
// use the express library
const express = require('express');

// create a new server application
const app = express();

// Define the port we will listen on
// (it will attempt to read an environment global
// first, that is for when this is used on the real
// world wide web).
const port = process.env.PORT || 3000;

// The main page of our website
app.use(express.static('public'));
const cookieParser = require('cookie-parser');
app.set('view engine', 'ejs');
app.use(cookieParser());
let nextVisitorId = 1;
let visitmessage = "";
app.get('/', (req, res) => {
  console.log(req.cookies);
  var visit = req.cookies.visited;
  if(req.cookies['visitorId']){
  res.cookie('visitorId', nextVisitorId);}
  else{
  res.cookie('visitorId', nextVisitorId++);}
  if(visit != undefined){
    visit = Math.floor((Date.now() - req.cookies.visited)/1000);
    visitmessage = "It has been ${visit} seconds since your last visit";
  }
  else {
  visitmessage = "You have never visited before.";
  }
  res.cookie('visited', Date.now());
  res.render('welcome', {
    name: req.query.name || "World",
    datetime: new Date().toLocaleString(),
    visit: nextVisitorId,
    visitmessage: visitmessage
  });

});

// Start listening for network connections
app.listen(port);

// Printout for readability
console.log("Server Started!");
