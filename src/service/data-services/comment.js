'use strict';

/**
 * Сервис для работы с комментариями к статье
 */
class CommentService {
  /**
   * @param {Sequelize} db - экземпляр sequelize подключенный к базе данных
   */
  constructor(db) {
    this._commentModel = db.models.Comment;
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
