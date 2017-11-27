let cp = require('child_process');
let fs = require('fs');
let isRunning = require('is-running');
let proxy = require('express-http-proxy');
let { dirname } = require('path');
let { promisify } = require('util');

let readFile = promisify(fs.readFile.bind(fs));

async function jsonRead(path) {
  let ret = null;

  try {
    ret = JSON.parse(await readFile(path, {
      encoding: 'utf8',
    }));
  }
  catch(err) {
  }

  return ret;
}

module.exports = async (subdomain) => {
  let path = `${process.env.HOME}/.fuf/${subdomain}.json`;

  let app = await jsonRead(path);

  if (!app) {
    throw new Error(`${subdomain} is not configured.`);
  }

  let running = isRunning(app.pid);

  if (!running) {
    console.log(`Starting ${subdomain}.`);

    let { args, cmd } = app;
    let cwd = dirname(cmd);

    cp.spawn(cmd, args || [], { cwd });

    app = await (async () => {
      let giveUp = false;

      setTimeout(() => {
        giveUp = true;
      }, 5000);

      while (!giveUp) {
        let newApp = await jsonRead(path);

        if (newApp && isRunning(newApp.pid)) {
          return newApp;
        }
      }
    })();

    if (!app) {
      throw new Error(`Start timeout for ${subdomain}.`);
    }
  }

  return proxy(`localhost:${app.port}`);
};
