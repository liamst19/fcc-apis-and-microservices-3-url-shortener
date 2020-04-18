'use strict';

const url_regex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
const dns = require('dns');

var express = require('express');
var bodyParser = require('body-parser')

var mongo = require('mongodb');
var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.DB_URI);

// Schema
const urlSchema = new Schema({
  original_url: { type: String, required: true }
})

// Model
const Url = mongoose.model('Url', urlSchema);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.text());

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.post('/api/posthello', (req, res) => {
  console.log(req.body)
  res.json({ posted: req.body, time: new Date()})
})

app.post('/api/shorturl/new', (req, res) => {
  const url = req.body;
  
  if(url_regex.test(url)){
    dns.lookup(url, e => {
      console.log('valid url', e)
      return res.json({
        "success": true
      });
    });
  } else return res.json({"error":"invalid URL"});
})


app.listen(port, function () {
  console.log('Node.js listening ...');
});