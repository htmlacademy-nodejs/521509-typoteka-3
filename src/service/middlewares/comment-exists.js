'use strict';

/**
 * MiddleWare для проверки, что комментарий существует.
 * Прикрепляет к res.locals найденный комментарий.
 */
const {HttpCode} = require(`../../consts`);

module.exports = (commentService) => (req, res, next) => {
  req.log.debug(`Checking that comment exists...`);

  const {article} = res.locals;
  const commentId = req.params[`commentId`];

  try {
    req.log.debug(`Comment exists...`);
    res.locals.comment = commentService.getOne(article, commentId);
    next();
  } catch (err) {
    req.log.debug(`Comment doesn't exist...`);
    res.status(HttpCode.NOT_FOUND).json({error: {code: HttpCode.NOT_FOUND, message: `Comment doesn't exist`, details: err.message}});
  }
};
