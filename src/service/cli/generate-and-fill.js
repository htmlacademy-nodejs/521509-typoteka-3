'use strict';

/**
 * Этот модуль генерирует данные для моков.
 * Если не было указано количество статей - то количество статей генерируется по умолчанию.
 *
 * Моки сохраняются в указанный файл в корневой директории  в указанной константе FILE_NAME.
 *
 * Данные для генерации взяты из задания.
 *
 *  @module src/service/cli/generate
 */

const path = require(`path`);

const DB = require(`../db`);
const refillDB = require(`../db/refill-db`);

const Logger = require(`../../lib/logger`);
const mockUsers = require(`../../../data/mock-test-data`).users;

const {
  getRandomNumber,
  getRandomItemInArray,
  getRandomItemsInArray,
  getRandomDateInPast,
  readFileToArray} = require(`../../utils`);
const {ExitCodes} = require(`../../consts`);

/**
 * Число статей по умолчанию
 * @const
 * @type {number}
 * @default 1
 */
const DEFAULT_COUNT = 1;

/**
 * Максимальное число генерируемых статей
 * @const
 * @type {number}
 * @default 1000
 */
const MAX_COUNT = 1000;

/**
 * Относительный путь к корневому каталогу
 * @const
 * @type {string}
 * @default `../../../`
 */
const PATH_TO_ROOT_FOLDER = `../../../`;


/**
 * Путь к файлу с категориями относительно корневого каталога.
 * @const
 * @type {string}
 * @default `data/categories.txt
 */
const PATH_TO_CATEGORIES = `data/categories.txt`;

/**
 * Путь к файлу с заголовками относительно корневого каталога.
 * @const
 * @type {string}
 * @default `data/titles.txt
 */
const PATH_TO_TITLES = `data/titles.txt`;

/**
 * Путь к файлу с текстовыми предложениями относительно корневого каталога.
 * @const
 * @type {string}
 * @default `data/sentences.txt
 */
const PATH_TO_SENTENCES = `data/sentences.txt`;

/**
 * Путь к файлу с комментариями относительно корневого каталога.
 * @const
 * @type {string}
 * @default `data/comments.txt
 */
const PATH_TO_COMMENTS = `data/comments.txt`;

/**
 * Путь к файлу с комментариями относительно корневого каталога.
 * @const
 * @type {string}
 * @default `data/comments.txt
 */
const PATH_TO_IMAGES = `data/images.txt`;

/**
 * Максимальное число предложений в анонсе.
 * @const
 * @type {Number}
 * @default 2
 */
const MAX_ANNOUNCE_COUNT = 2;

/**
 * Максимальное число предложений в анонсе.
 * @const
 * @type {Number}
 * @default 3
 */
const MAX_TEXT_COUNT = 3;

/**
 * Максимальное число предложений в комментарии.
 * @const
 * @type {Number}
 * @default 5
 */
const MAX_COMMENT_LENGTH = 5;

/**
 * Максимальное количество комментариев в объявлении
 * @const
 * @type {Number}
 * @default 5
 */
const MAX_COMMENTS_COUNT = 5;

/**
 * Максимальный интервал в прошлом в миллисекундах
 * @const
 * @type {Number}
 * @default 90 дней ~ 3 месяца
 */
const MAX_PAST = 3 * 30 * 24 * 60 * 60 * 1000;

/**
 * Генерирует статью по переданным параметрам.
 *
 * @param {String[]} commentSentences - массив предложений для комментариев
 * @param {Object[]} users - массив пользователей
 * @return {{id: String, text: String}} - объект комментария
 */
const generateComment = (commentSentences, users) => {
  const comment = {
    text: getRandomItemsInArray(commentSentences, MAX_COMMENT_LENGTH).join(` `)
  };
  comment[`user_id`] = getRandomItemInArray(users).id;
  return comment;
};

/**
 * Генерирует статью по переданным параметрам.
 *
 * @param {String[]} titles - массив заголовков
 * @param {String[]} sentences - массив предложений
 * @param {Object[]} categoriesObjects - массив объектов категорий
 * @param {String[]} images - массив с названиями картинок
 * @param {String[]} commentSentences - массив предложений для комментариев
 * @param {Object[]} users - массив пользователей
 * @return {{id: String, title: String, publishedAt: String, text: String, category: String[], image: String, announce: String, comments: Object[], user_id: Number}} - объект статьи
 */
const generateArticle = (titles, sentences, categoriesObjects, images, commentSentences, users) => {
  const isWithImage = !!getRandomNumber(0, 2);
  const article = {
    title: getRandomItemInArray(titles),
    publishedAt: getRandomDateInPast(MAX_PAST).toISOString(),
    announce: getRandomItemsInArray(sentences, MAX_ANNOUNCE_COUNT).join(` `),
    text: getRandomItemsInArray(sentences, MAX_TEXT_COUNT).join(` `),
    image: isWithImage ? getRandomItemInArray(images) : null,
    categories: getRandomItemsInArray(categoriesObjects).map((it) => it.id),
    comments: Array(getRandomNumber(0, MAX_COMMENTS_COUNT)).fill({}).map(() => generateComment(commentSentences, users)),
  };
  // самый первый пользователь автор статей
  article[`user_id`] = users[0].id;
  return article;
};

/**
 * Генерирует статьи по переданным параметрам и количеству.
 *
 * @param {Number} count - количество статьей
 * @param {String[]} titles - массив заголовков
 * @param {String[]} sentences - массив предложений
 * @param {Object[]} categoriesObjects - массив объектов категорий
 * @param {String[]} images - массив с названиями картинок
 * @param {String[]} commentSentences - массив предложений для комментариев
 * @param {Object[]} users - массив пользователей
 * @return {Object[]} - массив статей
 */
const generateArticles = (count, titles, sentences, categoriesObjects, images, commentSentences, users) => {
  return Array(count).fill({}).map(() => generateArticle(titles, sentences, categoriesObjects, images, commentSentences, users));
};


/**
 * Читает данные из файлов, превращая пути в абсолютные.
 *
 * @param {string} filePath - принимает относительный путь (относительно корня проекта)
 * @return {Promise<String[]>} - возвращает promise с массивом
 */
const readDataForGeneration = async (filePath) => {
  const absolutePath = path.join(__dirname, PATH_TO_ROOT_FOLDER, filePath);
  return await readFileToArray(absolutePath);
};

module.exports = {
  name: `--generate`,

  /**
   * Метод run запускает генерацию статей и записывает их в указанный файл
   *
   * @async
   * @param {String} count - число статей полученных от пользователя.
   */

  async run(count) {
    const logger = new Logger(`fill-db`).getLogger();

    /**
     * Проверяем введенное число статей.
     */
    let countNumber = Number.parseInt(count, 10);
    if ((countNumber !== 0) && !countNumber) {
      countNumber = DEFAULT_COUNT;
      logger.error(`Count number is undefined. Default count will be generated ${countNumber}.`);
    } else if (countNumber <= 0) {
      logger.error(`Count number is null or negative number.`);
      process.exit(ExitCodes.FAIL);
    } else if (countNumber > MAX_COUNT) {
      logger.error(`Too big count for generating. Maximum count is ${MAX_COUNT}.`);
      process.exit(ExitCodes.FAIL);
    }

    /**
     * Пробуем подключиться к базе данных.
     */

    const db = new DB().getDB();
    try {
      logger.info(`Connecting to DB...`);
      await db.authenticate();
      logger.info(`Connection with DB is established.`);
    } catch (error) {
      logger.error(`Couldn't connect to DB: ${error}`);
      process.exit(ExitCodes.FAIL);
    }

    let titles;
    let sentences;
    let categories;
    let images;
    let commentsSentences;

    try {
      /**
       * Читаем файлы с данными параллельно
       */
      [titles, sentences, categories, images, commentsSentences] = await Promise.all([
        readDataForGeneration(PATH_TO_TITLES),
        readDataForGeneration(PATH_TO_SENTENCES),
        readDataForGeneration(PATH_TO_CATEGORIES),
        readDataForGeneration(PATH_TO_IMAGES),
        readDataForGeneration(PATH_TO_COMMENTS)
      ]);

      /**
       * Запускаем генерацию статей.
       */
      const categoriesObjects = categories.map((it, index) => ({id: index + 1, title: it}));
      const articles = generateArticles(countNumber, titles, sentences, categoriesObjects, images, commentsSentences, mockUsers);

      // const usersWithHashedPass = await hashUsersPass(mockUsers);
      // usersWithHashedPass[0].isAuthor = true;

      logger.info(`Generated ${articles.length} articles.`);

      logger.info(`Refill data...`);

      await refillDB(db, {articles, categories, users: mockUsers});

      logger.info(`Refilled ${articles.length} articles.`);

      await db.close();


    } catch (err) {
      logger.error(`Error: ${err.stack}`);
      process.exit(ExitCodes.FAIL);
    }
  }
};
