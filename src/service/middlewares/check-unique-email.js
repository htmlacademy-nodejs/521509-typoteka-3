'use strict';

/**
 * MiddleWare для проверки, что пользователь с таким email не существует.
 */
const {HttpCode} = require(`../../consts`);

module.exports = (userService) => async (req, res, next) => {
  req.log.debug(`Checking that email is unique...`);

  const {email} = req.body;

  try {
    await userService.isEmailUnique(email);
    req.log.debug(`Email is unique.`);
    next();

  } catch (err) {
    req.log.debug(`Email is not unique.`);
    res.status(HttpCode.BAD_REQUEST).json({error: {code: HttpCode.BAD_REQUEST, message: `User with such email exists.`, details: [`Пользователь с таким e-mail уже существует, попробуйте войти.`]}});
  }

};
