const path = require('path');
const express = require('express');
let port = 4200;
const root = [__dirname, path.sep, 'dist'].join(''); // __dirname

const app = express();

app.use(express.static(root));

function openDefaultBrowser (url) {
  var exec = require('child_process').exec;
  switch (process.platform) {
    case "darwin":
      exec('open ' + url);
      break;
    case "win32":
      exec('start ' + url);
      break;
    default:
      exec('xdg-open', [url]);
  }
}

let server;

function listenOK() {
  let _url = 'http://localhost:' + port;

  console.log('Dynamic Web TWAIN sample is listening on localhost:%s,', port);
  console.log(['open your browser on ', "\x1b[32m\x1b[4m", _url, "\x1b[0m"].join(''));

  openDefaultBrowser(_url);
}

function start() {
  
  server = app.listen(port, '127.0.0.1', listenOK);
  server.on('error', (err) => {
    port++;
    setTimeout(start, 300);
  });

}

start();