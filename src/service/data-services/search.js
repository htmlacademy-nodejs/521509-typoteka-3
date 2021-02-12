'use strict';

/**
 * Сервис для работы с поиском
 */

class SearchService {
  /**
   * @param {Object[]} articles - массив статей
   */
  constructor(articles) {
    this._articles = articles;
  }

  /**
   * Поиск по заголовкам статей.
   * @param {String} searchText - поисковый запрос
   * @return {Object[]} - найденные статьи
   */
  searchByTitle(searchText) {
    return this._articles.filter((it) => it.title.toLowerCase().includes(searchText.toLowerCase()));
  }
}

module.exports = SearchService;
