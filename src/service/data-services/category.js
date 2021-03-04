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
          attributes: [],
          required: true
        }]
      });
      return result.map((it)=> it.get());
    }
    return await this._categoryModel.findAll({raw: true});
  }

  /**
   * Добавление комментария к статье
   * @async
   * @param {{title: String}} categoryData - статья
   * @return {Object} - добавленная категория с id
   */
  async add(categoryData) {
    return this._categoryModel.create(categoryData);
  }


  /**
   * Удаление комментария к статье
   * @async
   * @param {Number} categoryId - id категории
   */
  async delete(categoryId) {
    const deletedRows = await this._categoryModel.destroy({where: {'id': categoryId}});
    return !!deletedRows;
  }

  /**
   * Обновление статьи по id
   * @async
   * @param {String} id - id статьи
   * @param {Object} categoryData - новая категория
   * @return {Object} - обновленная категория
   */
  async update(id, categoryData) {
    const updatedCategory = await this._categoryModel.update(categoryData, {
      where: {id},
      returning: true,
      plain: true
    });

    // Это только в постгресе работает.
    return updatedCategory[1].get();
  }
}

module.exports = CategoryService;
