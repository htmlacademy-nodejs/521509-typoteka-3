'use strict';

const express = require(`express`);
const request = require(`supertest`);

const categoriesRouter = require(`./categories`);
const CategoryService = require(`../data-services/category`);

const mockLogger = require(`../middlewares/mock-logger`);

const DB = require(`../db`);
const refillDB = require(`../db/refill-db`);

const {HttpCode} = require(`../../consts`);

const mockData = require(`../../../data/mock-test-data`);

let app;
let db;

beforeAll(async () => {
  db = new DB().getDB();
  await refillDB(db, mockData);

  app = express();
  app.use(express.json());
  app.use(mockLogger);
  app.use(`/categories`, categoriesRouter(new CategoryService(db)));
});

describe(`API returns category list`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/categories`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns list of 5 categories`, () => expect(response.body.length).toBe(5));

  test(`Categories names are IT, Деревья, За жизнь, Без рамки, Разное, IT`,
      () => expect(response.body.map((it) => it.title)).toEqual(
          expect.arrayContaining([`Деревья`, `За жизнь`, `Без рамки`, `Разное`, `IT`])
      )
  );

  afterAll(async ()=>{
    await db.close();
  });

});
