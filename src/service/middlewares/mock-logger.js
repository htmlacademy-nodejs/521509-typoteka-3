'use strict';

/**
 * MiddleWare для подмены express-logger для тестов
 */

const mockLogger = () => true;

module.exports = (req, res, next) => {
  req.log = {
    info: mockLogger,
    debug: mockLogger,
    error: mockLogger
  };
  next();
};
