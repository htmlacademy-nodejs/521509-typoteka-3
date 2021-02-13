'use strict';
const {getDefaultLoggerChild} = require(`../lib/logger`);

const {HttpCode} = require(`../../consts`);

const REQUIRED_COMMENT_KEYS = [`text`];

const logger = getDefaultLoggerChild({name: `api`});

module.exports = (req, res, next) => {
  const comment = req.body;
  const errors = [];
  const keys = Object.keys(comment);

  logger.debug(`Comment validation...`);

  REQUIRED_COMMENT_KEYS.forEach((key) => {
    if (!keys.includes(key)) {
      errors.push(`Key "${key}" is not presented.`);
    }
  });

  if (errors.length) {
    logger.debug(`Comment validation failed.`);
    res.status(HttpCode.BAD_REQUEST).json({error: {code: HttpCode.BAD_REQUEST, message: `Comment validation failed`, details: errors}});
    return;
  }

  logger.debug(`Comment validation finished.`);
  next();
};
