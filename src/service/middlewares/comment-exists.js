'use strict';

/**
 * MiddleWare для проверки, что комментарий существует.
 * Прикрепляет к res.locals найденный комментарий.
 */
const {getDefaultLoggerChild} = require(`../lib/logger`);

const {HttpCode} = require(`../../consts`);

const logger = getDefaultLoggerChild({name: `api`});

module.exports = (commentService) => (req, res, next) => {
  logger.debug(`Checking that comment exists...`);

  const {article} = res.locals;
  const commentId = req.params[`commentId`];

  try {
    logger.debug(`Comment exists...`);
    res.locals.comment = commentService.getOne(article, commentId);
    next();
  } catch (err) {
    logger.debug(`Comment doesn't exist...`);
    res.status(HttpCode.NOT_FOUND).json({error: {code: HttpCode.NOT_FOUND, message: `Comment doesn't exist`, details: err.message}});
  }
};
