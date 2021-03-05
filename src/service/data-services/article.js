'use strict';

const Aliases = require(`../db/models/aliase`);
const Sequelize = require(`sequelize`);

/**
 * Сервис для работы cо статьями
 */
class ArticleService {
  /**
   * @param {Sequelize} db - экземпляр sequelize подключенный к базе данных
   */
  constructor(db) {
    this._db = db;
    this._articleModel = db.models.Article;
    this._userModel = db.models.User;
    this._categoryModel = db.models.Category;
    this._commentModel = db.models.Comment;
    this._articlesPerPage = +process.env.ARTICLES_COUNT_PER_PAGE;
  }

  _getTotalPages(count) {
    return Math.ceil(count / (this._articlesPerPage));
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
   * @param {Number} currentPage - запрашиваемая страница
   * @param {Boolean} isForAdmin - для администратора ли запрос (отдаст ещё не опубликованные)
   * @return {Object[]}
   */
  async getAll({isWithComments, currentPage, isForAdmin}) {
    const include = [Aliases.CATEGORIES];
    const order = [[`published_at`, `DESC`]];
    let where = null;

    if (isWithComments) {
      include.push(Aliases.COMMENTS);
      order.push([Aliases.COMMENTS, `created_at`, `DESC`]);
    }

    if (!isForAdmin) {
      where = {
        publishedAt: {
          [Sequelize.Op.lt]: new Date(Date.now())
        }
      };
    }

    const {count, rows} = await this._articleModel.findAndCountAll({
      include,
      order,
      where,
      distinct: true,
      limit: this._articlesPerPage,
      offset: (currentPage - 1) * (this._articlesPerPage)
    });
    return {count, totalPages: this._getTotalPages(count), articles: rows};
  }

  /**
   * Отдача самых обсуждаемых статей.
   *
   * @async
   * @return {Object[]}
   */
  async getMostDiscussed() {
    const [results] = await this._db.query(
        `SELECT
                articles.id,
                articles.announce,
                comments_count.count as "commentsCount"
              FROM articles
              INNER JOIN (
                SELECT
                  article_id,
                  COUNT(article_id)
                FROM comments
                GROUP BY article_id
                )AS comments_count ON comments_count.article_id = articles.id
              ORDER BY comments_count.count DESC
              LIMIT ${process.env.ARTICLES_MOST_DISCUSSED_COUNT}
              ;`
    );

    return results;
  }

  /**
   * Отдача статей для указанной категории.
   * @async
   * @param {Boolean} isWithComments - нужны ли комментарии
   * @param {Number} currentPage - номер страницы
   * @param {Number} categoryId - id категории
   * @return {Object[]}
   */
  async getByCategory({isWithComments, currentPage, categoryId}) {
    const order = [[`published_at`, `DESC`]];
    // получаем id статей на 1 странице.
    const {count, rows} = await this._articleModel.findAndCountAll({
      attributes: [`id`, `published_at`],
      order,
      limit: this._articlesPerPage,
      offset: (this._articlesPerPage * (currentPage - 1)),
      distinct: true,
      where: {
        publishedAt: {
          [Sequelize.Op.lt]: new Date(Date.now())
        }
      },
      include: [{
        attributes: [],
        model: this._categoryModel,
        as: Aliases.CATEGORIES,
        through: {
          where: {
            'category_id': categoryId
          },
          required: true
        },
        required: true
      }]
    });

    // получаем полные статьи по найденным id.
    const include = [Aliases.CATEGORIES];
    if (isWithComments) {
      include.push(Aliases.COMMENTS);
      order.push([Aliases.COMMENTS, `created_at`, `DESC`]);
    }
    const articles = await this._articleModel.findAll({
      where: {
        id: rows.map((it) => it.id)
      },
      include,
      order
    });

    return {count, totalPages: this._getTotalPages(count), articles: articles.map((item) => item.get())};
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
      include: [Aliases.CATEGORIES, {
        model: this._commentModel,
        as: Aliases.COMMENTS,
        include: [{
          model: this._userModel,
          as: Aliases.USERS,
          attributes: [`firstName`, `lastName`, `avatar`],
          required: true
        }]
      }]
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
