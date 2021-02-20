'use strict';

const {DataTypes, Model} = require(`sequelize`);

module.exports = (db) => {
  class Category extends Model {}

  Category.init({
    // Согласно ТЗ категория - Минимум 5 символов. Максимум 30
    title: {
      type: DataTypes.STRING(30),// eslint-disable-line
      allowNull: false,
      unique: true
    }
  }, {
    sequelize: db,
    modelName: `Category`,
    tableName: `categories`,
    timestamps: true,
    createdAt: `created_at`,
    updatedAt: `updated_at`
  });

  return Category;
};
