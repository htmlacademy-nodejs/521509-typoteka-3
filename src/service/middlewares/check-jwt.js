'use strict';

/**
 * MiddleWare для проверки, что пользователь не подделал токены, прикрепляет к res.locals данные в ключе.
 */
const {HttpCode} = require(`../../consts`);
const JWTHelper = require(`../lib/jwt-helper`);


const getAuthToken = (authHeader) => {
  if (!authHeader) {
    throw new Error(`There isn't any Auth Header`);
  }

  const tokenParts = authHeader.split(` `);

  if (!tokenParts || !tokenParts[1]) {
    throw new Error(`Token is in invalid format. It should be: "Bearer {{ token }}"`);
  }

  return tokenParts[1];
};


module.exports = async (req, res, next) => {
  req.log.debug(`Checking JWT...`);

  try {
    const accessToken = getAuthToken(req.headers[`authorization`]);

    res.locals.user = await JWTHelper.verifyToken(accessToken);
    req.log.debug(`JWT is valid.`);
    next();
  } catch (error) {
    req.log.debug(`JWT is invalid. ${error}`);
    res.status(HttpCode.FORBIDDEN).json({error: {code: HttpCode.FORBIDDEN, message: `Auth failed.`, details: [error.message]}});
  }

};
