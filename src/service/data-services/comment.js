'use strict';
const Aliases = require(`../db/models/aliase`);

/**
 * Сервис для работы с комментариями к статье
 */
class CommentService {
  /**
   * @param {Sequelize} db - экземпляр sequelize подключенный к базе данных
   */
  constructor(db) {
    this._commentModel = db.models.Comment;
    this._articleModel = db.models.Article;
  }

  /**
   * Добавление комментария к статье
   * @async
   * @param {Number} articleId - статья
   * @param {Object} commentData - добавляемый комментарий
   * @return {Object} - добавленный комментарий с id
   */
  async add(articleId, commentData) {
    return await this._commentModel.create({'article_id': articleId, ...commentData});
  }


  /**
   * Удаление комментария к статье
   * @async
   * @param {Number} commentId - id комментария
   */
  async delete(commentId) {
    const deletedRows = await this._commentModel.destroy({where: {'id': commentId}});
    return !!deletedRows;
  }


  /**
   * Возвращает все комментарии к статье
   * @async
   * @param {Number} articleId - Id статьи
   * @return {Object[]} - массив комментариев
   */
  async getAll(articleId) {
    return await this._commentModel.findAll({
      order: [[`created_at`, `DESC`]],
      where:
        {
          'article_id': articleId
        },
      raw: true
    });
  }

  /**
   * Возвращает самые последние комментарии
   * @async
   * @param {Boolean} onlyLast - все ли комментарии или только последние
   * @return {Object[]} - массив комментариев
   */
  async getLast(onlyLast = true) {
    const limit = onlyLast ? process.env.LAST_COMMENTS_COUNT : null;
    const comments = await this._commentModel.findAll({
      order: [[`created_at`, `DESC`]],
      include: [
        Aliases.USERS
      ],
      limit
    });

    return comments.map((comment) => comment.get());
  }

  /**
   * Возвращает комментарий к статье по id
   * @async
   * @param {String} commentId - id комментария
   * @return {Object} - комментарий
   */
  async getOne(commentId) {
    const comment = await this._commentModel.findByPk(commentId);
    return comment.get();
  }
}

module.exports = CommentService;
