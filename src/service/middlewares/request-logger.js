'use strict';

/**
 * MiddleWare логирования всех обращений.
 */

const {getDefaultLoggerChild} = require(`../lib/logger`);
const logger = getDefaultLoggerChild({name: `api`});

module.exports = (req, res, next) => {
  logger.debug(`New request on URL ${req.originalUrl}`);
  res.on(`finish`, () => {
    logger.info(`Request on URL ${req.originalUrl} is finished with status code: ${res.statusCode}`);
  });

  next();
};
