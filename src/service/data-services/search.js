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
    const articles = await this._articleModel.findAll({
      where: {
        title: {
          [Op.iLike]: `%${searchText}%`
        }
      },
      include: [Aliases.CATEGORIES]
    });
    return articles.map((offer) => offer.get());
  }
}

module.exports = SearchService;
