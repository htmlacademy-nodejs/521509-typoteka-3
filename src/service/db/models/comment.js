'use strict';

const {DataTypes, Model} = require(`sequelize`);

module.exports = (db) => {
  class Comment extends Model {}

  Comment.init({
    text: {
      type: DataTypes.STRING(1000),// eslint-disable-line
      allowNull: false
    }
  }, {
    sequelize: db,
    modelName: `Comment`,
    tableName: `comments`,
    timestamps: true,
    paranoid: true,
    createdAt: `created_at`,
    updatedAt: `updated_at`,
    deletedAt: `deleted_at`
  });

  return Comment;
};
