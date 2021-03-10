'use strict';

/**
 * MiddleWare для проверки, что комментарий существует.
 * Прикрепляет к res.locals найденный комментарий.
 */
const {HttpCode} = require(`../../consts`);

module.exports = (commentService) => async (req, res, next) => {
  req.log.debug(`Checking that comment exists...`);

  const commentId = req.params[`commentId`];

  try {
    res.locals.comment = await commentService.getOne(commentId);
    req.log.debug(`Comment exists.`);
    next();
  } catch (error) {
    req.log.debug(`Comment doesn't exist...${error.message}`);
    res.status(HttpCode.NOT_FOUND).json({error: {code: HttpCode.NOT_FOUND, message: `Comment doesn't exist`, details: error.message}});
  }
};
