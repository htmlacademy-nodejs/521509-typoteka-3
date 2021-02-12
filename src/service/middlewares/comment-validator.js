'use strict';

const {HttpCode} = require(`../../consts`);

const REQUIRED_COMMENT_KEYS = [`text`];

module.exports = (req, res, next) => {
  const comment = req.body;
  const errors = [];
  const keys = Object.keys(comment);

  REQUIRED_COMMENT_KEYS.forEach((key) => {
    if (!keys.includes(key)) {
      errors.push(`Key "${key}" is not presented.`);
    }
  });

  if (errors.length) {
    res.status(HttpCode.BAD_REQUEST).json({error: {code: HttpCode.BAD_REQUEST, message: `Comment validation failed`, details: errors}});
    return;
  }

  next();
};
