'use strict';

/**
 * Роутер для статей. ('/articles')
 */
const {api, articlesRoutes, uploaderMiddleware} = require(`../utils/init-articles-router`)();
const prepareArticleData = require(`../utils/prepare-article-data`);
const {checkAndReturnPositiveNumber} = require(`../../utils`);

/**
 * Обработка маршрута для добавления статьи - открывается пустая форма для редактирования
 */
articlesRoutes.get(`/add`, async (req, res) => {
  const categories = await api.getCategories();
  res.render(`pages/articles/edit-article`, {article: {}, categories, isNew: true});
});

/**
 * Принятие новой статьи
 */
articlesRoutes.post(`/add`, uploaderMiddleware.single(`file`), async (req, res) => {
  const {body, file} = req;

  const articleData = prepareArticleData(body, file);

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (e) {
    const categories = await api.getCategories();
    // из формы категории были массивом id, а не массивом объектов с id, приводим к нужному типу.
    articleData.categories = articleData.categories.map((id) => ({id}));
    const errors = e.response ? e.response.data.error.details.join(`\n`) : `Ошибка сервера, невозможно выполнить запрос. \n, ${e.message}`;
    res.render(`pages/articles/edit-article`, {article: articleData, categories, errors, isNew: true});
  }
});


/**
 * Обработка маршрута для статьи
 */
articlesRoutes.get(`/:id`, (req, res) => res.render(`pages/articles/article`));


/**
 * Обработка маршрута для редактирования статьи
 */
articlesRoutes.get(`/edit/:id`, async (req, res) => {
  let article;
  let categories;
  try {
    [article, categories] = await Promise.all([api.getArticle(req.params[`id`]), api.getCategories()]);
    res.render(`pages/articles/edit-article`, {article, categories, isNew: false});
  } catch (err) {
    req.log.info(`Article is not found`);
    res.redirect(`/404`);
  }
});

/**
 * Принятие новой статьи
 */
articlesRoutes.post(`/edit/:id`, uploaderMiddleware.single(`file`), async (req, res) => {
  const {id} = req.params;
  const {body, file} = req;

  const articleData = prepareArticleData(body, file);
  delete articleData.id;

  try {
    await api.updateArticle(id, articleData);
    res.redirect(`/my`);
  } catch (e) {
    const categories = await api.getCategories();
    // из формы категории были массивом id, а не массивом объектов с id, приводим к нужному типу.
    articleData.categories = articleData.categories.map((it) => ({id: it}));
    const errors = e.response ? e.response.data.error.details.join(`\n`) : `Ошибка сервера, невозможно выполнить запрос. \n, ${e.message}`;
    res.render(`pages/articles/edit-article`, {article: articleData, categories, errors, isNew: false});
  }
});


/**
 * Обработка маршрута для категории
 */
articlesRoutes.get(`/category/:id`, async (req, res, next) => {
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
    res.render(`pages/articles/articles-by-category`, {articles, page, totalPages, prefix: req.originalUrl.split(`?`)[0], categories, currentCategoryId});
  } catch (e) {
    next(e);
  }
});


module.exports = articlesRoutes;
