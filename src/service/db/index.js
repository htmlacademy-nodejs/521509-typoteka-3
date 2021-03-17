'use strict';

/**
 * Модуль подключает sequelize c параметрами окружения из .env
 */
const Sequelize = require(`sequelize`);
const Logger = require(`../../lib/logger`);

const defineModels = require(`./models`);

const {Env} = require(`../../consts`);

require(`dotenv`).config();

/**
 * Забираем все необходимые переменные
 */
const {
  DB_HOST,
  DB_TEST_HOST,
  DB_PORT,
  DB_TEST_PORT,
  DB_NAME,
  DB_TEST_NAME,
  DB_USER,
  DB_TEST_USER,
  DB_PASSWORD,
  DB_TEST_PASSWORD,
  DB_POOL_MAX_CONNECTIONS,
  DB_POOL_MIN_CONNECTIONS,
  DB_POOL_ACQUIRE,
  DB_POOL_IDLE,
  DB_DIALECT,
  DB_TEST_DIALECT
} = process.env;


class DataBase {
  constructor() {
    this._db = null;
  }

  /**
   * Функция отдает экземпляр Sequelize
   * @return {sequelize.Sequelize}
   */
  getDB() {
    if (!this._db) {
      this._checkEnv();

      const logger = new Logger(`db`).getLogger();

      if (process.env.NODE_ENV === Env.TESTING) {
        this._db = new Sequelize(
            DB_TEST_NAME,
            DB_TEST_USER,
            DB_TEST_PASSWORD, {
              host: DB_TEST_HOST,
              port: DB_TEST_PORT,
              dialect: DB_TEST_DIALECT,
              pool: {
                max: +DB_POOL_MAX_CONNECTIONS,
                min: +DB_POOL_MIN_CONNECTIONS,
                acquire: +DB_POOL_ACQUIRE,
                idle: +DB_POOL_IDLE
              },
              logging: logger.debug.bind(logger)
            }
        );
      } else {
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
      }

      this._defineModels();
    }
    return this._db;
  }

  /**
   * Проверяем, что нам всего хватает для подключения, если нет, кидаем ошибку.
   * @return {Boolean}
   */
  _checkEnv() {
    let someThingNotDefined;

    if (process.env.NODE_ENV === Env.TESTING) {
      someThingNotDefined = [DB_TEST_HOST, DB_TEST_PORT, DB_TEST_NAME, DB_TEST_USER, DB_TEST_PASSWORD, DB_POOL_MAX_CONNECTIONS, DB_POOL_MIN_CONNECTIONS, DB_POOL_ACQUIRE, DB_POOL_IDLE, DB_TEST_DIALECT].some((it) => it === undefined);
    } else {
      someThingNotDefined = [DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, DB_POOL_MAX_CONNECTIONS, DB_POOL_MIN_CONNECTIONS, DB_POOL_ACQUIRE, DB_POOL_IDLE, DB_DIALECT].some((it) => it === undefined);
    }

    if (someThingNotDefined) {
      throw new Error(`Not all environment's variables are found. See .env.example.`);
    }

    return someThingNotDefined;
  }

  _defineModels() {
    defineModels(this._db);
  }

}

module.exports = DataBase;
