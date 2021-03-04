'use strict';

/**
 * MiddleWare для проверки, что пользователь с таким email не существует.
 */
const {HttpCode} = require(`../../consts`);

module.exports = (categoryService) => async (req, res, next) => {
  req.log.debug(`Checking that category is unique...`);

  try {
    await categoryService.isTitleUnique(req.body.title);
    req.log.debug(`Title is unique.`);
    next();

  } catch (err) {
    req.log.debug(`Title is not unique. ${err}`);
    res.status(HttpCode.BAD_REQUEST).json({error: {code: HttpCode.BAD_REQUEST, message: `Category with such title exists`, details: [`Категория с таким названием существует.`]}});
  }

};
