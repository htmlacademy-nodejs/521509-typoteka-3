'use strict';

const express = require(`express`);
const supertest = require(`supertest`);

const searchRouter = require(`./search`);
const SearchService = require(`../data-services/search`);

const {HttpCode} = require(`../../consts`);

const mockArticles = require(`../../../data/mock-test-data`).articles;

let app;

beforeAll(() => {
  app = express();
  app.use(express.json());
  app.use(`/search`, searchRouter(new SearchService(mockArticles)));
});

let response;

describe(`Search API returns articles based on search query`, () => {

  beforeAll(async () => {
    response = await supertest(app)
      .get(`/search`)
      .query({query: `обзор`});
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe((HttpCode.OK)));
  test(`1 article found`, () => expect(response.body.length).toBe(1));
  test(`Article has correct id`, () => expect(response.body[0].id).toBe(`2H0r`));
});

describe(`Search API returns empty array if nothing found`, () => {

  beforeAll(async () => {
    response = await supertest(app)
      .get(`/search`)
      .query({query: `продам коляску`});
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe((HttpCode.OK)));
  test(`0 articles found`, () => expect(response.body.length).toBe(0));
});

describe(`Search API returns 400 and error, if query is missing`, () => {

  beforeAll(async () => {
    response = await supertest(app)
      .get(`/search`);
  });

  test(`Status code 400`, () => expect(response.statusCode).toBe((HttpCode.BAD_REQUEST)));
  test(`Message is correct`, () => expect(response.body.error.message).toBe(`Query string is empty.`));
});
