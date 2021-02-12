'use strict';

const {nanoid} = require(`nanoid`);

const {MAX_ID_LENGTH} = require(`../../consts`);

/**
 * Сервис для работы cо статьями
 */
class ArticleService {
  /**
   * @param {Object[]} articles - массив статей
   */
  constructor(articles) {
    this._articles = articles;
  }

  /**
   * Приватный метод поиска индекса по статьям. Вызывает ошибку, если индекс не найден.
   *
   * @param {String} id - id искомой статьи
   * @return {number} - возвращает индекс найденной статьи.
   * @private
   */
  _findIndexById(id) {
    const index = this._articles.findIndex((it) => it.id === id);

    if (index < 0) {
      throw new Error(`Not Found article with ID ${id}`);
    }

    return index;
  }

  /**
   * Добавление новой статьи с добавлением к нему id и пустого массива с комментариями.
   *
   * @param {Object} articleData - статья
   * @return {Object} - возвращает созданную статью
   */
  add(articleData) {
    const newArticle = {...articleData, id: nanoid(MAX_ID_LENGTH), comments: []};

    this._articles.push(newArticle);

    return newArticle;
  }

  /**
   * Удаление статьи по id
   * @param {String} id - id статьи
   */
  delete(id) {
    this._articles.splice(this._findIndexById(id), 1);
  }

  /**
   * Отдача всех статей.
   * @return {Object[]}
   */
  getAll() {
    return this._articles;
  }

  /**
   * Отдает статью по Id
   * @param {String} id - id статьи
   * @return {Object} - найденная статья
   */
  getOne(id) {
    return this._articles[this._findIndexById(id)];
  }

  /**
   * Обновление статьи по id
   * @param {String} id - id статьи
   * @param {Object} article - новая статья
   * @return {Object} - обновленная статья
   */
  update(id, article) {
    const index = this._findIndexById(id);
    this._articles[index] = {...this._articles[index], ...article};
    return this._articles[index];
  }
}

module.exports = ArticleService;
