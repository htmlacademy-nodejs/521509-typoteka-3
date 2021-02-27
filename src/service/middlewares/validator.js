'use strict';

/**
 * MiddleWare для валидации согласно переданной схеме.
 */

const {HttpCode} = require(`../../consts`);

module.exports = (validationSchema, validationObjectName = ``) => async (req, res, next) => {
  const body = req.body;

  req.log.debug(`${validationObjectName} validation is starting...`);


  try {
    await validationSchema.validateAsync(body, {abortEarly: false});
    req.log.debug(`${validationObjectName} validation finished successfully.`);
    next();
  } catch (error) {
    req.log.debug(`${validationObjectName} validation failed: ${error}`);
    res.status(HttpCode.BAD_REQUEST).json({
      error: {
        code: HttpCode.BAD_REQUEST,
        message: `${validationObjectName} validation failed.`,
        details: error.details.map((it) => it.message)
      }
    });
  }
};

