'use strict';

const url_regex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
const dns = require('dns');

var express = require('express');
var bodyParser = require('body-parser')

var mongo = require('mongodb');
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.DB_URI);

// Schema
const urlSchema = new Schema({
  original_url: { type: String, required: true, unique: true }
})

urlSchema.plugin(uniqueValidator);
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
  console.log(url)
  const urlRegex = /^(https?:\/\/)([\w.]+)(\/[\w-]+)?$/
  const name = url.match(urlRegex); 
  let retVal = { "error":"invalid URL" };
  if(name.length > 2){
    dns.lookup(name[2], (e, r) => {
      console.log({name: name[2], ...e, r})
      if(!e){
        // Look for preexisting
        const fromDb = Url.find({ original_url: url });
        if(fromDb.length > 0){
          retVal = { original_url: fromDb.original_url,"short_url": fromDb._id };
        } else {
          (new Url({ original_url: url })).save(err => {
            
          })
        }
        // Save to DB
        
        
        
      }
      res.json(retVal);
    });
  } else res.json(retVal)
  });


app.listen(port, function () {
  console.log('Node.js listening ...');
});