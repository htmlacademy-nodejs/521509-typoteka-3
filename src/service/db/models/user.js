'use strict';

const {DataTypes, Model} = require(`sequelize`);

module.exports = (db) => {
  class User extends Model {}

  User.init({
    firstName: {
      type: DataTypes.STRING(35),// eslint-disable-line
      allowNull: false,
      field: `first_name`
    },
    lastName: {
      type: DataTypes.STRING(35),// eslint-disable-line
      allowNull: false,
      field: `last_name`
    },
    email: {
      type: DataTypes.STRING(255),// eslint-disable-line
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(255),// eslint-disable-line
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING(255)// eslint-disable-line
    },
    /**
     * Согласно ТЗ автор может быть только один и это первый пользователь.
     * На мой взгляд рано или поздно, появится второй автор. Для этого нужно будет убрать флаг unique.
     */
    isAuthor: {
      type: DataTypes.BOOLEAN,
      defaultValue: null,
      unique: true
    }
  }, {
    sequelize: db,
    modelName: `User`,
    tableName: `users`,
    timestamps: true,
    createdAt: `created_at`,
    updatedAt: `updated_at`
  });

  return User;
};

