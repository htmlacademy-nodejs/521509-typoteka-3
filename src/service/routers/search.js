'use strict';

const {Router} = require(`express`);

const {HttpCode} = require(`../../consts`);
const {checkAndReturnPositiveNumber} = require(`../../utils`);

module.exports = (searchService) => {
  const router = new Router();

  router.get(`/`, async (req, res, next) => {
    try {
      const {query = ``, page} = req.query;

      if (!query) {
        req.log.debug(`Search query string is empty.`);
        res.status(HttpCode.BAD_REQUEST).json({error: {code: HttpCode.BAD_REQUEST, message: `Query string is empty.`, details: `Query string is empty. Check it.`}});
        return;
      }

      /**
       * Пытаемся понять, была ли передана страница, если нет, то возвращаем первую страницу по умолчанию
       */
      const currentPage = checkAndReturnPositiveNumber(page, 1);

      const searchResults = await searchService.searchByTitle({searchText: query, currentPage});

      res.status(HttpCode.OK).json(searchResults);
    } catch (error) {
      next(error);
    }
  });

  return router;
};
