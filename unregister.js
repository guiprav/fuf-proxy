let fs = require('fs');
let { promisify } = require('util');

let unlink = promisify(fs.unlink.bind(fs));

module.exports = subdomain => {
  let path = `${process.env.HOME}/.fuf/${subdomain}.json`;
  return unlink(path);
};
