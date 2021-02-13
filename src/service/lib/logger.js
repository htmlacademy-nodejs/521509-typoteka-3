'use strict';

const pino = require(`pino`);

const {Env} = require(`../../consts`);

const LOG_FILE = `./logs/api.log`;

const DEFAULT_LOG_NAME = `base-logger`;

/**
 * Создаем экземпляр дефолтного логгера, чтобы каждый модуль не создавал свой базовый, а создавал только дочерние.
 * @type {Logger}
 */
let defaultLogger;

class Logger {
  constructor(name = DEFAULT_LOG_NAME) {
    switch (process.env.NODE_ENV) {
      case Env.PRODUCTION:
        this._level = process.env.LOG_LEVEL || `error`;
        this._isPrettyPrintEnabled = false;
        this._logsDestination = pino.destination(LOG_FILE);
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
  }

  getLogger() {
    return this._logger;
  }

  static getDefaultLoggerChild(options = {}) {
    if (!defaultLogger) {
      defaultLogger = new Logger().getLogger();
    }
    return defaultLogger.child(options);
  }
}


/**
 * Экспортируем Logger
 * @type {Logger}
 */
module.exports = {Logger, getDefaultLoggerChild: Logger.getDefaultLoggerChild};
