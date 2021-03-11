'use strict';

const {Op} = require(`sequelize`);
const Aliases = require(`../db/models/aliase`);
const {DEFAULT_SEARCH_RESULTS_PER_PAGE} = require(`../../consts`);


/**
 * Сервис для работы с поиском
 */

class SearchService {
  /**
   * @param {Sequelize} db - экземпляр sequelize подключенный к базе данных
   */
  constructor(db) {
    this._articleModel = db.models.Article;
    this._searchResultsPerPage = +process.env.SEARCH_RESULTS_PER_PAGE || DEFAULT_SEARCH_RESULTS_PER_PAGE;
  }

  /**
   * Поиск по заголовкам статей.
   * @async
   * @param {String} searchText - поисковый запрос
   * @param {Number} currentPage - номер текущей страницы
   * @return {Object[]} - найденные статьи
   */
  async searchByTitle({searchText, currentPage = 1} = {}) {
    const {count, rows} = await this._articleModel.findAndCountAll({
      where: {
        title: {
          [Op.iLike]: `%${searchText}%`
        }
      },
      include: [Aliases.CATEGORIES],
      order: [[`published_at`, `DESC`]],
      distinct: true,
      limit: this._searchResultsPerPage,
      offset: (currentPage - 1) * (this._searchResultsPerPage)
    });
    return {count, totalPages: this._getTotalPages(count), articles: rows};
  }

  _getTotalPages(count) {
    return Math.ceil(count / (this._searchResultsPerPage));
  }
}

module.exports = SearchService;
