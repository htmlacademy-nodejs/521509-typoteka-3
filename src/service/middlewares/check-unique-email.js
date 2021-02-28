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
    res.status(HttpCode.NOT_FOUND).json({error: {code: HttpCode.NOT_FOUND, message: `User with such email exists.`, details: [`Пользователь с таким e-mail уже существует, попробуйте войти.`]}});
  }

};
