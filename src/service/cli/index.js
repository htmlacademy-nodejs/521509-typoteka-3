'use strict';

const version = require(`./version`);
const generate = require(`./generate`);
const help = require(`./help`);

const Cli = {
  [version.name]: version,
  [generate.name]: generate,
  [help.name]: help,
};


module.exports = {Cli};
