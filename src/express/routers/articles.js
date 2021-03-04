'use strict';

/**
 * Роутер для статей. ('/articles')
 */
const {api, articlesRoutes, uploaderMiddleware, checkUserAuthMiddleware, checkUserIsAuthorMiddleware} = require(`../utils/init-articles-router`)();
const prepareArticleData = require(`../utils/prepare-article-data`);


const {checkAndReturnPositiveNumber} = require(`../../utils`);

/**
 * Обработка маршрута для добавления статьи - открывается пустая форма для редактирования
 */
articlesRoutes.get(`/add`,
    [
      checkUserAuthMiddleware,
      checkUserIsAuthorMiddleware
    ],
    async (req, res, next) => {
      try {
        const categories = await api.getCategories();
        res.render(`pages/articles/edit-article`, {article: {}, categories, errors: {}, isNew: true, currentUser: res.locals.user});
      } catch (e) {
        next(e);
      }
    });

/**
 * Принятие новой статьи
 */
articlesRoutes.post(`/add`,
    [
      checkUserAuthMiddleware,
      checkUserIsAuthorMiddleware,
      uploaderMiddleware.single(`file`)
    ],
    async (req, res) => {
      const {body, file} = req;
      let articleData = {};

      try {
        articleData = prepareArticleData(body, file);
        await api.createArticle(articleData, res.locals.accessToken);
        res.redirect(`/my`);
      } catch (e) {
        const categories = await api.getCategories();
        // из формы категории были массивом id, а не массивом объектов с id, приводим к нужному типу.
        articleData.categories = articleData.categories.map((id) => ({id}));
        const errors = e.response ? e.response.data.error.details : [`Внутренняя ошибка сервера, выполните запрос позже./Internal Server Error`];
        res.render(`pages/articles/edit-article`, {article: articleData, categories, errors, isNew: true, currentUser: res.locals.user});
      }
    });


/**
 * Обработка маршрута для статьи
 */
articlesRoutes.get(`/:id`, checkUserAuthMiddleware, (req, res) => res.render(`pages/articles/article`));


/**
 * Обработка маршрута для редактирования статьи
 */
articlesRoutes.get(`/edit/:id`,
    [
      checkUserAuthMiddleware,
      checkUserIsAuthorMiddleware
    ],
    async (req, res) => {
      let article;
      let categories;
      try {
        [article, categories] = await Promise.all([api.getArticle(req.params[`id`]), api.getCategories()]);
        res.render(`pages/articles/edit-article`, {article, categories, isNew: false, errors: {}, currentUser: res.locals.user});
      } catch (err) {
        req.log.info(`Article is not found`);
        res.redirect(`/404`);
      }
    });

/**
 * Редактирование статьи
 */
articlesRoutes.post(`/edit/:id`,
    [
      checkUserAuthMiddleware,
      checkUserIsAuthorMiddleware,
      uploaderMiddleware.single(`file`)
    ],
    async (req, res) => {
      const {id} = req.params;
      const {body, file} = req;

      let articleData;

      try {
        articleData = prepareArticleData(body, file);
        delete articleData.id;

        await api.updateArticle(id, articleData, res.locals.accessToken);
        res.redirect(`/my`);
      } catch (e) {
        const categories = await api.getCategories();
        // из формы категории были массивом id, а не массивом объектов с id, приводим к нужному типу.
        articleData.categories = articleData.categories.map((it) => ({id: it}));
        articleData.id = id;

        const errors = e.response ? e.response.data.error.details : [`Внутренняя ошибка сервера, выполните запрос позже./Internal Server Error`];
        res.render(`pages/articles/edit-article`, {article: articleData, categories, errors, isNew: false, currentUser: res.locals.user});
      }
    });


/**
 * Обработка маршрута для категории
 */
articlesRoutes.get(`/category/:id`, checkUserAuthMiddleware, async (req, res, next) => {
  try {
    const currentCategoryId = +req.params[`id`];

    /**
     * Пытаемся понять, была ли передана страница, если нет, то возвращаем первую страницу по умолчанию
     */
    const page = checkAndReturnPositiveNumber(req.query.page, 1);

    const [{totalPages, articles}, categories] = await Promise.all([
      api.getArticles({page, isWithComments: true, categoryId: currentCategoryId}),
      api.getCategories({isWithCount: true})
    ]);
    res.render(`pages/articles/articles-by-category`, {articles, page, totalPages, prefix: req.originalUrl.split(`?`)[0], categories, currentCategoryId, currentUser: res.locals.user});
  } catch (e) {
    next(e);
  }
});


module.exports = articlesRoutes;
