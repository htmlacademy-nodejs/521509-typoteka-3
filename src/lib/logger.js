'use strict';

const path = require(`path`);

const pino = require(`pino`);
const expressPinoLogger = require(`express-pino-logger`);

const {Env} = require(`../consts`);
const {createDirIfNotExists} = require(`../utils`);

const DEFAULT_LOG_NAME = `base-logger`;

class Logger {
  constructor(name = DEFAULT_LOG_NAME) {
    switch (process.env.NODE_ENV) {
      case Env.PRODUCTION:
        this._level = process.env.LOG_LEVEL || `info`;
        this._isPrettyPrintEnabled = false;
        createDirIfNotExists(path.resolve(process.env.LOG_FOLDER));
        this._logsDestination = pino.destination(path.join(process.env.LOG_FOLDER, `${name}.log`));
        break;
      case Env.TESTING:
        this._level = process.env.LOG_LEVEL || `silent`;
        this._isPrettyPrintEnabled = false;
        this._logsDestination = process.stdout;
        break;
      default:
        this._level = process.env.LOG_LEVEL || `debug`;
        this._isPrettyPrintEnabled = true;
        this._logsDestination = process.stdout;
        break;
    }

    this._logger = pino({
      name,
      level: this._level,
      prettyPrint: this._isPrettyPrintEnabled
    }, this._logsDestination);

    this._loggerMiddleware = null;
  }

  getLogger() {
    return this._logger;
  }

  getLoggerMiddleware(name = `express-middleware`) {
    if (!this._loggerMiddleware) {
      this._loggerMiddleware = expressPinoLogger({
        logger: this._logger.child({name})
      });
    }
    return this._loggerMiddleware;
  }
}


module.exports = Logger;
