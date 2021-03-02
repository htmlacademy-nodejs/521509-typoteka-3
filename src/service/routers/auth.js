'use strict';

const {Router} = require(`express`);

const getValidatorMiddleware = require(`../middlewares/validator`);

const authUserValidationSchema = require(`../validation-schemas/auth-user`);

const JWTHelper = require(`../lib/jwt-helper`);

const {HttpCode} = require(`../../consts`);

module.exports = (userService) => {
  const router = new Router();

  router.post(`/`,
      [
        getValidatorMiddleware(authUserValidationSchema, `User`),
      ],
      async (req, res) => {
        try {
          const {email, password} = req.body;

          const user = await userService.checkUser(email, password);

          const tokens = JWTHelper.generateTokens(user);


          res.status(HttpCode.OK).json(tokens);
        } catch (e) {
          req.log.debug(e.message);
          res.status(HttpCode.BAD_REQUEST).json({
            error: {
              code: HttpCode.BAD_REQUEST,
              message: `User with such e-mail and password not found.`,
              details: [`Пользователь с таким e-mail и паролем не существует.`]
            }
          });
        }
      });

  router.post(`/refresh`,
      async (req, res) => {
        try {
          const {refreshToken} = req.body;

          const tokens = await JWTHelper.refreshAccessToken(refreshToken);

          res.status(HttpCode.OK).json(tokens);
        } catch (e) {
          req.log.debug(e.message);
          res.status(HttpCode.BAD_REQUEST).json({
            error: {
              code: HttpCode.BAD_REQUEST,
              message: `Invalid refresh token.`,
              details: e.message
            }
          });
        }
      });

  return router;
};
