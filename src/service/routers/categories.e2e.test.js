'use strict';

const express = require(`express`);
const request = require(`supertest`);

const categoriesRouter = require(`./categories`);
const CategoryService = require(`../data-services/category`);

const {HttpCode} = require(`../../consts`);

const mockArticles = require(`../../../data/mock-test-data`).articles;

let app;

beforeAll(() => {
  app = express();
  app.use(express.json());
  app.use(`/categories`, categoriesRouter(new CategoryService(mockArticles)));
});

describe(`API returns category list`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/categories`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns list of 7 categories`, () => expect(response.body.length).toBe(7));

  test(`Categories names are IT, Деревья, Железо, Музыка, Без рамки, Кино, Разное`,
      () => expect(response.body).toEqual(
          expect.arrayContaining([`IT`, `Деревья`, `Железо`, `Музыка`, `Без рамки`, `Кино`, `Разное`])
      )
  );

});
