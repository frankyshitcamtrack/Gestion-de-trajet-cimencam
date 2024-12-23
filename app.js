const morgan = require('morgan');

const cors = require('cors');

const path = require('path');

const express = require('express');

const bodyParser = require('body-parser');

const app = express();

const trajetCimcamRouter = require('./src/routes/api.routes');

const {
  onGetEntryExitCimencam,
  onGetEntryExitNotifications,
  onGetTrajetCimencam,
} = require('./src/controllers/api.controllers');

app.use(morgan('combined'));

app.use(cors());

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(express.static('public'));

app.use('/cimencam', trajetCimcamRouter);

onGetEntryExitNotifications();
onGetTrajetCimencam();

setInterval(() => {
  onGetEntryExitNotifications();
}, 3600000);

setInterval(() => {
  onGetTrajetCimencam();
}, 21600000);

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.end('<h1>Application started : Trajet cimencam</h1>');
  console.log('Application started');
});

module.exports = app;
