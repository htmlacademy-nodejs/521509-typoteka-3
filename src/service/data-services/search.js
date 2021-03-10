'use strict';

const {Op} = require(`sequelize`);
const Aliases = require(`../db/models/aliase`);

/**
 * Сервис для работы с поиском
 */

class SearchService {
  /**
   * @param {Sequelize} db - экземпляр sequelize подключенный к базе данных
   */
  constructor(db) {
    this._articleModel = db.models.Article;
  }

  /**
   * Поиск по заголовкам статей.
   * @async
   * @param {String} searchText - поисковый запрос
   * @return {Object[]} - найденные статьи
   */
  async searchByTitle(searchText) {
    const {count, rows} = await this._articleModel.findAndCountAll({
      where: {
        title: {
          [Op.iLike]: `%${searchText}%`
        }
      },
      include: [Aliases.CATEGORIES],
      order: [[`published_at`, `DESC`]],
      distinct: true
    });
    return {count, articles: rows};
  }
}

module.exports = SearchService;
