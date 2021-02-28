'use strict';

const {Router} = require(`express`);

const getValidatorMiddleware = require(`../middlewares/validator`);
const getCheckUniqueEmailMiddleware = require(`../middlewares/check-unique-email`);

const newUserValidationSchema = require(`../validation-schemas/new-user`);

const {HttpCode} = require(`../../consts`);

module.exports = (userService) => {
  const router = new Router();

  router.post(`/`,
      [
        getValidatorMiddleware(newUserValidationSchema, `User`),
        getCheckUniqueEmailMiddleware(userService)
      ],
      async (req, res, next) => {
        try {
          const userData = req.body;

          const newUser = await userService.add(userData);

          res.status(HttpCode.CREATED).json(newUser);
        } catch (e) {
          next(e);
        }
      });

  return router;
};
