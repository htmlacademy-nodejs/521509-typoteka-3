'use strict';

/**
 * Модуль подключает sequelize c параметрами окружения из .env
 */
const Sequelize = require(`sequelize`);
const Logger = require(`../../lib/logger`);

const defineModels = require(`./models`);

require(`dotenv`).config();

/**
 * Забираем все необходимые переменные
 */
const {
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_POOL_MAX_CONNECTIONS,
  DB_POOL_MIN_CONNECTIONS,
  DB_POOL_ACQUIRE,
  DB_POOL_IDLE,
  DB_DIALECT
} = process.env;


class DataBase {
  constructor() {
    this._db = null;
  }

  /**
   * Проверяем, что нам всего хватает для подключения, если нет, кидаем ошибку.
   * @return {Boolean}
   */
  _checkEnv() {
    const someThingNotDefined = [DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, DB_POOL_MAX_CONNECTIONS, DB_POOL_MIN_CONNECTIONS, DB_POOL_ACQUIRE, DB_POOL_IDLE, DB_DIALECT].some((it) => it === undefined);

    if (someThingNotDefined) {
      throw new Error(`Not all environment's variables are found. See .env.example.`);
    }

    return someThingNotDefined;
  }

  _defineModels() {
    defineModels(this._db);
  }


  /**
   * Функция отдает экземпляр Sequelize
   * @return {sequelize.Sequelize}
   */
  getDB() {
    if (!this._db) {
      const logger = new Logger(`db`).getLogger();

      this._db = new Sequelize(
          DB_NAME,
          DB_USER,
          DB_PASSWORD, {
            host: DB_HOST,
            port: DB_PORT,
            dialect: DB_DIALECT,
            pool: {
              max: +DB_POOL_MAX_CONNECTIONS,
              min: +DB_POOL_MIN_CONNECTIONS,
              acquire: +DB_POOL_ACQUIRE,
              idle: +DB_POOL_IDLE
            },
            logging: logger.debug.bind(logger)
          }
      );

      this._defineModels();
    }
    return this._db;
  }
}

module.exports = DataBase;
