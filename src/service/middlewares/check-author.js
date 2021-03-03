'use strict';

/**
 * MiddleWare для проверки, что пользователь в res.locals является автором.
 * ! Перед запуском этой middleware всегда должна быть сначала check-jwt.js.
 */
const {HttpCode} = require(`../../consts`);

module.exports = (req, res, next) => {
  req.log.debug(`Checking that user is author...`);

  if (!res.locals.user || !res.locals.user.isAuthor) {
    req.log.debug(`User isn't author.`);
    res.status(HttpCode.FORBIDDEN).json({error: {code: HttpCode.FORBIDDEN, message: `User isn't author.`, details: `Only author can use this endpoint.`}});
    return;
  }

  req.log.debug(`User is author.`);
  next();

};
