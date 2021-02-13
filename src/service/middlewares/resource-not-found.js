'use strict';

/**
 * MiddleWare для обработки 404 ошибки.
 */
const {getDefaultLoggerChild} = require(`../lib/logger`);

const {HttpCode} = require(`../../consts`);

const logger = getDefaultLoggerChild({name: `api`});

module.exports = (req, res) => {
  res.status(HttpCode.NOT_FOUND).json({error: {code: HttpCode.NOT_FOUND, message: `Not Found`, details: `This endpoint is not presented`}});

  logger.error(`[404] Resource not found: ${req.url}`);
};
