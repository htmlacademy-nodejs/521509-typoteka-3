'use strict';

const {checkAndReturnPositiveNumber, parseDate} = require(`../../utils`);

module.exports = (reqBody, reqFile) => {
  const fileName = reqFile ? reqFile.filename : reqBody.image;

  return {
    image: fileName ? fileName : null,
    title: reqBody.title,
    announce: reqBody.announce,
    text: reqBody.text ? reqBody.text : null,
    // микро проверка, что за категории были выбраны, приводим к типу Number и фильтруем
    categories: reqBody.categories.map((category) => (checkAndReturnPositiveNumber(category, null))).filter((category)=> category !== null),
    // дата в календаре через точку, парсим дату
    publishedAt: parseDate(reqBody[`published_at`])
  };
};
