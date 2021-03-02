'use strict';

/**
 * MiddleWare для проверки, что пользователь не подделал токены, прикрепляет к res.locals данные в ключе.
 */
const {HttpCode} = require(`../../consts`);
const JWTHelper = require(`../lib/jwt-helper`);

module.exports = async (req, res, next) => {
  req.log.debug(`Checking JWT...`);


  try {
    const accessToken = req.headers[`authorization`].split(` `)[1];

    res.locals.user = await JWTHelper.verifyToken(accessToken);
    req.log.debug(`JWT is valid.`);
    next();

  } catch (err) {
    req.log.debug(`JWT is invalid. ${err}`);
    res.status(HttpCode.FORBIDDEN).json({error: {code: HttpCode.FORBIDDEN, message: `Auth failed, try to refresh token.`, details: [err.message]}});
  }

};
