'use strict';

/**
 * MiddleWare для проверки, что статья существует.
 * Прикрепляет к res.locals найденную статью.
 */
const {getDefaultLoggerChild} = require(`../lib/logger`);

const {HttpCode} = require(`../../consts`);

const logger = getDefaultLoggerChild({name: `api`});

module.exports = (articleService) => (req, res, next) => {
  logger.debug(`Checking that article exists...`);

  const articleId = req.params[`articleId`];

  try {
    logger.debug(`Article exists...`);
    res.locals.article = articleService.getOne(articleId);
    next();

  } catch (err) {
    logger.debug(`Article doesn't exist...`);
    res.status(HttpCode.NOT_FOUND).json({error: {code: HttpCode.NOT_FOUND, message: `Article doesn't exist`, details: err.message}});
  }

};
