let fs = require('fs');
let { promisify } = require('util');

let writeFile = promisify(fs.writeFile.bind(fs));

module.exports = app => {
  let path = `${process.env.HOME}/.fuf/${app.subdomain}.json`;
  return writeFile(path, JSON.stringify(app));
};
