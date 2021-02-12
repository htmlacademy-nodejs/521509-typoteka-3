'use strict';

/**
 * Сервис для работы с категориями
 */

class CategoryService {
  /**
   * @param {Object[]} articles - массив статей
   */
  constructor(articles) {
    this._articles = articles;
  }

  /**
   * Ищет категории, который встречаются в статьях.
   * @return {String[]}
   */
  getAll() {
    const categories = [];
    this._articles.forEach((it) => categories.push(...it.categories));
    return [...new Set(categories)];
  }

}

module.exports = CategoryService;
