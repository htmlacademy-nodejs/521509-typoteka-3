'use strict';

/**
 * MiddleWare для обработки 500 ошибки.
 */

const {HttpCode} = require(`../../consts`);

module.exports = (err, req, res, _next) => {

  res.status(HttpCode.INTERNAL_SERVER_ERROR).json({error: {code: HttpCode.INTERNAL_SERVER_ERROR, message: `Internal Server Error`, details: `See logs [500] for more information.`}});

  console.error(`[500] Internal server error on URL: ${req.url}. Error: ${err.stack}.`);
};
