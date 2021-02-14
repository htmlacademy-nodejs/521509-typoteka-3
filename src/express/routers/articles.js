'use strict';

/**
 * Роутер для статей. ('/articles')
 */
const {api, articlesRoutes, uploaderMiddleware} = require(`../utils/init-articles-router`)();

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
  const articleData = {
    image: file ? file.filename : body.image,
    title: body.title,
    announce: body.announce,
    text: body.text,
    categories: body.categories
  };
  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (e) {
    res.redirect(`back`);
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
    res.render(`pages/articles/edit-article`, {article, categories});
  } catch (err) {
    req.log.info(`Article is not found`);
    res.redirect(`/404`);
  }
});


/**
 * Обработка маршрута для категории
 */
articlesRoutes.get(`/category/:id`, (req, res) => res.render(`pages/articles/articles-by-category`));


module.exports = articlesRoutes;
