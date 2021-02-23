'use strict';

const {DataTypes, Model} = require(`sequelize`);

module.exports = (db) => {
  class Article extends Model {}

  Article.init({
    // длина заголовка и анонса согласно ТЗ 250 символов
    title: {
      type: DataTypes.STRING(250),// eslint-disable-line
      allowNull: false
    },
    announce: {
      type: DataTypes.STRING(250),// eslint-disable-line
      allowNull: false
    },
    // длина текста согласно ТЗ 1000 символов, и поле является не обязательным(!?)
    text: {
      type: DataTypes.STRING(1000)// eslint-disable-line
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: `published_at`
    },
    image: {
      type: DataTypes.STRING(255),// eslint-disable-line
    }
    //   user_id добавить после в разделе авторизации
  }, {
    sequelize: db,
    modelName: `Article`,
    tableName: `articles`,
    timestamps: true,
    paranoid: true,
    createdAt: `created_at`,
    updatedAt: `updated_at`,
    deletedAt: `deleted_at`
  });

  return Article;
};

