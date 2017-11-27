#!/usr/bin/env node
let express = require('express');

let proxy = require('./proxy');

let app = express();
let host = 'localhost';
let port = process.env.PORT || 3000;

function getSubdomain(host) {
  return host.replace(/\.fuf\.me$/, '');
}

app.use(async (req, res) => {
  try {
    let subdomain = getSubdomain(req.hostname);
    let appProxy = await proxy(subdomain);

    return appProxy(req, res);
  }
  catch(err) {
    if (err.name === 'Error') {
      console.error(err.message);
    }
    else {
      console.error(err);
    }

    res.sendStatus(500);
  }
});

app.listen(port, host);
console.log(`Listening on ${host}:${port}.`);
