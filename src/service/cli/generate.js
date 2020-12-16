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
  writeFileInJSON} = require(`../../utils`);
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

const TITLES = [
  `Ёлки. История деревьев`,
  `Как перестать беспокоиться и начать жить`,
  `Как достигнуть успеха не вставая с кресла`,
  `Обзор новейшего смартфона`,
  `Лучшие рок-музыканты 20-века`,
  `Как начать программировать`,
  `Учим HTML и CSS`,
  `Что такое золотое сечение`,
  `Как собрать камни бесконечности`,
  `Борьба с прокрастинацией`,
  `Рок — это протест`,
  `Самый лучший музыкальный альбом этого года`
];

const SENTENCES = [
  `Ёлки — это не просто красивое дерево. Это прочная древесина.`,
  `Первая большая ёлка была установлена только в 1938 году.`,
  `Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
  `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
  `Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
  `Собрать камни бесконечности легко, если вы прирожденный герой.`,
  `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
  `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
  `Программировать не настолько сложно, как об этом говорят.`,
  `Простые ежедневные упражнения помогут достичь успеха.`,
  `Это один из лучших рок-музыкантов.`,
  `Он написал больше 30 хитов.`,
  `Из под его пера вышло 8 платиновых альбомов.`,
  `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
  `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
  `Достичь успеха помогут ежедневные повторения.`,
  `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
  `Как начать действовать? Для начала просто соберитесь.`,
  `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
  `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`
];

const CATEGORIES = [
  `Деревья`,
  `За жизнь`,
  `Без рамки`,
  `Разное`,
  `IT`,
  `Музыка`,
  `Кино`,
  `Программирование`,
  `Железо`
];


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

module.exports = {
  name: `--generate`,

  /**
   * Метод run запускает генерацию статей и записывает их в указанный файл
   *
   * @param {String} count - число статей полученных от пользователя.
   */

  run(count) {
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

    /**
     * Запускаем генерацию статей.
     */
    const articles = generateArticles(countNumber, TITLES, SENTENCES, CATEGORIES);
    console.log(chalk.green(`Сгенерировано ${articles.length} статей.`));

    /**
     * Записываем результат в файл.
     */
    writeFileInJSON(path.join(__dirname, PATH_TO_ROOT_FOLDER, FILE_NAME), articles, (err) => {
      if (err) {
        console.error(chalk.red(`Ошибка записи в файл ${FILE_NAME}: ${err.message}`));
        process.exit(ExitCodes.FAIL);
      }
      console.log(chalk.green(`Файл ${FILE_NAME} успешно записан.`));
    });
  }
};
