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

const chalk = require(`chalk`);

const {
  getRandomItemInArray,
  getRandomItemsInArray,
  getRandomDateInPast,
  writeFileInJSON,
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
 * Название файла для записи результата
 * @const
 * @type {string}
 * @default `mocks.json`
 */
const FILE_NAME = `mocks.json`;

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
 * Максимальное число предложений в анонсе.
 * @const
 * @type {Number}
 * @default 5
 */
const MAX_ANNOUNCE_COUNT = 5;

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
 * @param {String[]} titles - массив заголовков
 * @param {String[]} sentences - массив предложений
 * @param {String[]} categories - массив категорий
 * @return {{title: String, createdDate: Date, fullText: String, category: String[], announce: String}} - объект статьи
 */
const generateArticle = (titles, sentences, categories) => {
  return {
    title: getRandomItemInArray(titles),
    createdDate: getRandomDateInPast(MAX_PAST),
    announce: getRandomItemsInArray(sentences, MAX_ANNOUNCE_COUNT).join(``),
    fullText: getRandomItemsInArray(sentences).join(``),
    category: getRandomItemsInArray(categories)
  };
};

/**
 * Генерирует статьи по переданным параметрам и количеству.
 *
 * @param {Number} count - количество статьей
 * @param {String[]} titles - массив заголовков
 * @param {String[]} sentences - массив предложений
 * @param {String[]} categories - массив категорий
 * @return {Object[]} - массив статей
 */
const generateArticles = (count, titles, sentences, categories) => {
  return Array(count).fill(generateArticle(titles, sentences, categories));
};


/**
 * Читает данные из файлов, превращая пути в абсолютные.
 *
 * @param {string} filePath - принимает относительный путь (относительно корня проекта)
 * @return {Promise<String[]>} - возвращает promise с массивом
 */
const readDataForGeneration = async (filePath) => {
  const absolutePath = path.join(__dirname, PATH_TO_ROOT_FOLDER, filePath);
  const contentArray = await readFileToArray(absolutePath);
  return contentArray;
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
    /**
     * Проверяем введенное число статей.
     */
    let countNumber = Number.parseInt(count, 10);
    if ((countNumber !== 0) && !countNumber) {
      countNumber = DEFAULT_COUNT;
      console.log(chalk.red(`Число статей не указано. Будет создано ${countNumber} статей.`));
    } else if (countNumber <= 0) {
      console.error(chalk.red(`Указано не положительное число статей.`));
      process.exit(ExitCodes.FAIL);
    } else if (countNumber > MAX_COUNT) {
      console.error(chalk.red(`Указано число статей больше ${MAX_COUNT}. \nУкажи не больше ${MAX_COUNT} статей.`));
      process.exit(ExitCodes.FAIL);
    }

    let titles;
    let sentences;
    let categories;

    try {
      /**
       * Читаем файлы с данными параллельно
       */
      [titles, sentences, categories] = await Promise.all([
        readDataForGeneration(PATH_TO_TITLES),
        readDataForGeneration(PATH_TO_SENTENCES),
        readDataForGeneration(PATH_TO_CATEGORIES)
      ]);

      /**
       * Запускаем генерацию статей.
       */
      const articles = generateArticles(countNumber, titles, sentences, categories);
      console.log(chalk.green(`Сгенерировано ${articles.length} статей.`));

      /**
       * Записываем результат в файл.
       */
      await writeFileInJSON(path.join(__dirname, PATH_TO_ROOT_FOLDER, FILE_NAME), articles);
      console.log(chalk.green(`Файл ${FILE_NAME} успешно записан.`));
    } catch (err) {
      console.error(chalk.red(`Ошибка: ${err.message}`));
      process.exit(ExitCodes.FAIL);
    }
  }
};
