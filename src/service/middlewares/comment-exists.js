'use strict';

/**
 * MiddleWare для проверки, что комментарий существует.
 * Прикрепляет к res.locals найденный комментарий.
 */

const {HttpCode} = require(`../../consts`);

module.exports = (commentService) => (req, res, next) => {
  const {article} = res.locals;
  const commentId = req.params[`commentId`];

  try {
    res.locals.comment = commentService.getOne(article, commentId);
    next();
  } catch (err) {
    res.status(HttpCode.NOT_FOUND).json({error: {code: HttpCode.NOT_FOUND, message: `Comment doesn't exist`, details: err.message}});
  }
};
