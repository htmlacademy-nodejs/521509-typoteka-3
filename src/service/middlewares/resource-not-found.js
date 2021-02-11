'use strict';

/**
 * MiddleWare для обработки 404 ошибки.
 */

const {HttpCode} = require(`../../consts`);

module.exports = (req, res) => {

  res.status(HttpCode.NOT_FOUND).json({error: {code: HttpCode.NOT_FOUND, message: `Not Found`, details: `This endpoint is not presented`}});

  console.error(`[404] Resource not found: ${req.url}`);
};
