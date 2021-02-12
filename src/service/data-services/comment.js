'use strict';

const {nanoid} = require(`nanoid`);

const {ID_LENGTH} = require(`../../consts`);

/**
 * Сервис для работы с комментариями к статье
 */
class CommentService {
  /**
   * Приватный метод поиска индекса по комментариям. Вызывает ошибку, если индекс не найден.
   *
   * @param {Object} article - статья
   * @param {String} commentId - id искомого комментария
   * @return {number} - возвращает индекс найденной статьи.
   * @private
   */
  _findIndexById(article, commentId) {
    const index = article.comments.findIndex((it) => it.id === commentId);

    if (index < 0) {
      throw new Error(`Not found comment Id ${commentId} in article Id ${article.id}`);
    }

    return index;
  }


  /**
   * Добавление комментария к статье
   * @param {Object} article - статья
   * @param {Object} comment - добавляемый комментарий
   * @return {Object} - добавленный комментарий с id
   */
  add(article, comment) {
    const newComment = {...comment, id: nanoid(ID_LENGTH)};

    article.comments.push(newComment);

    return newComment;
  }


  /**
   * Удаление комментария к статье
   * @param {Object} article - статья
   * @param {String} commentId - id комментария
   */
  delete(article, commentId) {
    article.comments.splice(this._findIndexById(article, commentId), 1);
  }


  /**
   * Возвращает все комментарии к статье
   * @param {Object} article - статья
   * @return {Object[]} - массив комментариев
   */
  getAll(article) {
    return article.comments;
  }


  /**
   * Возвращает комментарий к статье по id
   * @param {Object} article - статья
   * @param {String} commentId - id комментария
   * @return {Object[]} - массив комментариев
   */
  getOne(article, commentId) {
    return article.comments[this._findIndexById(article, commentId)];
  }
}

module.exports = CommentService;
