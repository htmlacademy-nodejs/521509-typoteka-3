'use strict';

/**
 * MiddleWare для проверки валидности статьи.
 */
const {getDefaultLoggerChild} = require(`../lib/logger`);

const {HttpCode} = require(`../../consts`);

const REQUIRED_ARTICLE_KEYS = [`title`, `announce`, `text`, `categories`];

const logger = getDefaultLoggerChild({name: `api`});

module.exports = (req, res, next) => {
  const article = req.body;
  const errors = [];
  const keys = Object.keys(article);

  logger.debug(`Article validation...`);

  REQUIRED_ARTICLE_KEYS.forEach((key) => {
    if (!keys.includes(key)) {
      errors.push(`Key "${key}" is not presented.`);
    }
  });

  if (errors.length) {
    logger.debug(`Article validation failed.`);
    res.status(HttpCode.BAD_REQUEST).json({error: {code: HttpCode.BAD_REQUEST, message: `Article validation failed`, details: errors}});
    return;
  }

  logger.debug(`Article validation finished.`);
  next();
};
