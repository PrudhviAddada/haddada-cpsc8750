
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
let currdate = new Date();
app.get('/', (req, res) => {
  console.log(req.cookies);
  if(req.cookies['visitorId']){
  res.cookie('visitorId', nextVisitorId);}
  else
  res.cookie('visitorId', nextVisitorId++);
  res.cookie('visited', Date.now().toString());
  res.render('welcome', {
    name: req.query.name || "World",
    datetime: req.query.datetime || new Date().toLocaleString(),
    visit: req.query.visit || nextVisitorId,
    lasttime: req.query.lasttime || Math.round((new Date().getTime() - currdate.getTime()) / 1000),
  });
  currdate = new Date();

});

// Start listening for network connections
app.listen(port);

// Printout for readability
console.log("Server Started!");
