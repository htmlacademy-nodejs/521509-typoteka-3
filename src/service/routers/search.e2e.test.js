'use strict';

const express = require(`express`);
const supertest = require(`supertest`);

const searchRouter = require(`./search`);
const SearchService = require(`../data-services/search`);

const mockLogger = require(`../middlewares/mock-logger`);

const DB = require(`../db`);
const refillDB = require(`../db/refill-db`);

const {HttpCode} = require(`../../consts`);

const mockData = require(`../../../data/mock-test-data`);

let app;
let db;
let response;

beforeAll(async () => {
  db = new DB().getDB();
  await refillDB(db, mockData);

  app = express();
  app.use(express.json());
  app.use(mockLogger);
  app.use(`/search`, searchRouter(new SearchService(db)));
});

afterAll(async () => {
  await db.close();
});


describe(`Search API returns articles based on search query`, () => {
  beforeAll(async () => {
    response = await supertest(app)
      .get(`/search`)
      .query({query: `Обзор`});
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe((HttpCode.OK)));
  test(`1 article found`, () => {
    expect(response.body.count).toBe(1);
    expect(response.body.articles.length).toBe(1);
  });
  test(`Article has correct id`, () => expect(response.body.articles[0].id).toBe(1));
});

describe(`Search API returns empty array if nothing found`, () => {

  beforeAll(async () => {
    response = await supertest(app)
      .get(`/search`)
      .query({query: `продам коляску`});
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe((HttpCode.OK)));
  test(`0 articles found`, () => expect(response.body.articles.length).toBe(0));
});

describe(`Search API returns 400 and error, if query is missing`, () => {

  beforeAll(async () => {
    response = await supertest(app)
      .get(`/search`);
  });

  test(`Status code 400`, () => expect(response.statusCode).toBe((HttpCode.BAD_REQUEST)));
  test(`Message is correct`, () => expect(response.body.error.message).toBe(`Query string is empty.`));
});
