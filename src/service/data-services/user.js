'use strict';

// const Sequelize = require(`sequelize`);
// const Aliases = require(`../db/models/aliase`);
const bcrypt = require(`bcrypt`);

/**
 * Сервис для работы с пользователями
 */
class UserService {
  /**
   * @param {Sequelize} db - экземпляр sequelize подключенный к базе данных
   */
  constructor(db) {
    this._userModel = db.models.User;
    this._saltRounds = Number.parseInt(process.env.PASSWORD_SALT_ROUNDS, 10);
  }

  /**
   * Добавление нового пользователя.
   *
   * @async
   * @param {Object} userData - пользователь
   * @return {Promise}
   */
  async add(userData) {
    const author = await this._userModel.findOne({
      where: {
        isAuthor: true
      },
      raw: true
    });

    if (!author) {
      userData.isAuthor = true;
    }

    userData.password = await bcrypt.hash(userData.password, this._saltRounds);
    const user = await this._userModel.create(userData);
    const rawUser = user.get();
    return {
      id: rawUser.id,
      firstName: rawUser.firstName,
      lastName: rawUser.lastName,
      avatar: rawUser.avatar
    };
  }

  /**
   * Отдает пользователя по Id
   * @async
   * @param {Number} id - id пользователя
   * @return {Object} - найденный пользователь
   */
  async getOne(id) {
    const user = await this._userModel.findByPk(id);
    return user.get();
  }

  /**
   * Проверяет уникальность email
   * @async
   * @param {String} email - email пользователя
   * @return {Boolean} - Уникальный ли email
   */
  async isEmailUnique(email) {
    const user = await this._userModel.findOne({
      where: {
        email
      },
      raw: true
    });
    if (user) {
      throw new Error(`Email isn't unique.`);
    }
    return true;
  }

  /**
   * Проверяет пользователя по Id или email
   * @async
   * @param {Number} id - email пользователя
   * @param {String} password - email пользователя
   * @return {Object} - найденный пользователь
   */
  async checkUser(id, password) {
    const user = this.getOne(id);

    return await bcrypt.compare(password, user.password);
  }
}

module.exports = UserService;
