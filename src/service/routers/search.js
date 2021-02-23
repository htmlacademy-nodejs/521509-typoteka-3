'use strict';

const {Router} = require(`express`);

const {HttpCode} = require(`../../consts`);

module.exports = (searchService) => {
  const router = new Router();

  router.get(`/`, async (req, res, next) => {
    try {
      const {query = ``} = req.query;

      if (!query) {
        req.log.debug(`Search query string is empty.`);
        res.status(HttpCode.BAD_REQUEST).json({error: {code: HttpCode.BAD_REQUEST, message: `Query string is empty.`, details: `Query string is empty. Check it.`}});
        return;
      }

      const searchResults = await searchService.searchByTitle(query);

      res.status(HttpCode.OK).json(searchResults);
    } catch (e) {
      next(e);
    }
  });

  return router;
};
