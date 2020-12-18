'use strict';

const version = require(`./version`);
const generate = require(`./generate`);
const help = require(`./help`);
const server = require(`./server`);

const Cli = {
  [version.name]: version,
  [generate.name]: generate,
  [help.name]: help,
  [server.name]: server
};


module.exports = {Cli};
