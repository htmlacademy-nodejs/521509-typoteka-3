'use strict';

const Sequelize = require(`sequelize`);
const Aliases = require(`../db/models/aliase`);


/**
 * Сервис для работы с категориями
 */

class CategoryService {
  /**
   * @param {Sequelize} db - экземпляр sequelize подключенный к базе данных
   */
  constructor(db) {
    this._categoryModel = db.models.Category;
    this._articleCategoryModel = db.models.ArticleCategory;
  }

  /**
   * Отдает все категории.
   * @async
   * @param {Boolean} isWithCount - требуется ли посчитать, сколько объявлений в каждой категории
   * @return {Object[]} - массив категорий
   */
  async getAll(isWithCount) {
    if (isWithCount) {
      const result = await this._categoryModel.findAll({
        attributes: [
          `id`,
          `title`,
          [
            Sequelize.fn(
                `COUNT`,
                `*`
            ),
            `count`
          ]
        ],
        group: [Sequelize.col(`Category.id`)],
        include: [{
          model: this._articleCategoryModel,
          as: Aliases.ARTICLES_CATEGORIES,
          attributes: []
        }]
      });
      return result.map((it)=> it.get());
    }
    return await this._categoryModel.findAll({raw: true});
  }

}

module.exports = CategoryService;
