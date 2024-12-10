//const http = require('http');

//const PORT = process.env.PORT || 8000;

//const server = http.createServer(app);

const https = require('https');

const fs = require('fs');

require('dotenv').config();

const app = require('./app');

//locale
//const PORT = process.env.PORT || 8000;
//const server = http.createServer(app);

//production
const PORT = process.env.PORT || 8000;

const options = {
  key: fs.readFileSync('./ssl/camtracknet.key'),
  cert: fs.readFileSync('./ssl/camtracknet.crt'),
  ca: fs.readFileSync('./ssl/camtracknet.ca-bundle'),
};

const server = https.createServer(options, app);

async function startServer() {
  server.listen(PORT, () =>
    console.log(`Service is listening to port ${PORT}`)
  );
}

startServer();
