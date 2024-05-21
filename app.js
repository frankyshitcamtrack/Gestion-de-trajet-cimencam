const morgan = require("morgan")

const cors = require("cors")

const path = require('path')

const express = require("express");

const bodyParser = require("body-parser");

const app = express();

app.use(morgan('combined'));

app.use(cors());

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname,'..','public')));

app.use(express.static('public'))
 
//app.use("/", Router);


app.get("/",(req,res)=>{
    res.setHeader('Content-Type','text/html')
    res.end('<h1>Application started</h1>');
    console.log('Application started');
})


module.exports = app








