'use strict';

/**
 * MiddleWare для проверки параллельно переданных id, что они является числом.
 */
const idValidationSchema = require(`../validation-schemas/id`);

const {HttpCode} = require(`../../consts`);

module.exports = (...idFields) => async (req, res, next) => {

  req.log.debug(`Checking that id(s) are valid...`);

  const ids = idFields.map((idField) => req.params[idField]);

  try {
    await Promise.all(ids.map((id) => idValidationSchema.validateAsync(id)));
    req.log.debug(`Id(s) are valid.`);
    next();
  } catch (e) {
    res.status(HttpCode.BAD_REQUEST).json({
      error: {
        code: HttpCode.BAD_REQUEST,
        message: `Id is invalid`,
        details: e.details.map((it) => it.message)
      }
    });
    req.log.debug(`Id(s) are invalid.`);
  }
};
