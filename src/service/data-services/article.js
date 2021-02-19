'use strict';

const Aliases = require(`../db/models/aliase`);

/**
 * Сервис для работы cо статьями
 */
class ArticleService {
  /**
   * @param {Sequelize} db - экземпляр sequelize подключенный к базе данных
   */
  constructor(db) {
    this._articleModel = db.models.Article;
  }

  /**
   * Добавление новой статьи
   * @async
   * @param {Object} articleData - статья
   * @return {Object|undefined} - возвращает созданную статью
   */
  async add(articleData) {
    const article = await this._articleModel.create(articleData);
    await article.addCategories(articleData.categories);

    return article.get();
  }

  /**
   * Удаление статьи по id
   * @async
   * @param {String} id - id статьи
   * @return {Boolean} - возвращает true - если что-то удалил
   */
  async delete(id) {
    const deletedRows = await this._articleModel.destroy({
      where: {
        id
      }
    });

    return !!deletedRows;
  }

  /**
   * Отдача всех статей.
   * @async
   * @param {Boolean} isWithComments - нужны ли комментарии
   * @return {Object[]}
   */
  async getAll(isWithComments) {
    const include = [Aliases.CATEGORIES];
    const order = [[`published_at`, `DESC`]];
    if (isWithComments) {
      include.push(Aliases.COMMENTS);
      order.push([Aliases.COMMENTS, `created_at`, `DESC`]);
    }
    const articles = await this._articleModel.findAll({
      include,
      order
    });
    return articles.map((item) => item.get());
  }

  /**
   * Отдает статью по Id
   * @async
   * @param {String} id - id статьи
   * @return {Object} - найденная статья
   */
  async getOne(id) {
    const article = await this._articleModel.findByPk(id, {
      order: [[Aliases.COMMENTS, `created_at`, `DESC`]],
      include: [Aliases.CATEGORIES, Aliases.COMMENTS]
    });

    return article.get();
  }

  /**
   * Обновление статьи по id
   * @async
   * @param {String} id - id статьи
   * @param {Object} articleData - новая статья
   * @return {Object} - обновленная статья
   */
  async update(id, articleData) {
    const updatedOffer = await this._articleModel.update(articleData, {
      where: {id},
      returning: true,
      plain: true
    });

    // Это только в постгресе работает.
    return updatedOffer[1].get();
  }
}

module.exports = ArticleService;
