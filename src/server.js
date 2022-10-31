
// use the express library
const express = require('express');

// create a new server application
const app = express();

// Define the port we will listen on
// (it will attempt to read an environment global
// first, that is for when this is used on the real
// world wide web).
const port = process.env.PORT || 3000;
const fetch = require('node-fetch');
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

app.get("/trivia", async(req, res) => {
      // fetch the data
      const response = await fetch("https://opentdb.com/api.php?amount=1&type=multiple");
  
      // fail if bad response
      if (!response.ok) {
          res.status(500);
          res.send(`Open Trivia Database failed with HTTP code ${response.status}`);
          return;
      }
  
      // interpret the body as json
      const content = await response.json();
  
      // fail if db failed
      if (content.response_code !== 0) {
          res.status(500);
          res.send(`Open Trivia Database failed with internal response code ${content.response_code}`);
          return;
      }
  
      // respond to the browser
      correctAnswer = content.results[0]['correct_answer']
      answers = content.results[0]['incorrect_answers']
      answers.push(correctAnswer)
      let crt_ans = answers.sort(function() {
          return Math.random() - 0.5;
      });
      const answerLinks = crt_ans.map(answer => {
          return `<a style='color:white' href="javascript:alert('${
            answer === correctAnswer ? 'Correct!' : 'Incorrect, Please Try Again!'
            }')">${answer}</a>`
      })
      res.render('trivia', {
          question: content.results[0]['question'],
          category: content.results[0]['category'],
          difficulty: content.results[0]['difficulty'],
          answers: answerLinks
      })
  });

// Start listening for network connections
app.listen(port);

// Printout for readability
console.log("Server Started!");
