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

const NEW_CATEGORY = {
  title: `Category from JEST`,
};

const createAPI = async () => {
  const db = new DB().getDB();
  await refillDB(db, mockData);

  const app = express();
  app.use(express.json());
  app.use(mockLogger);

  app.use(`/categories`, categoriesRouter(new CategoryService(db)));
  return {app, db};
};

describe(`API returns category list`, () => {
  let app;
  let db;
  let response;

  beforeAll(async () => {
    ({app, db} = await createAPI());
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


describe(`API creates category if data is valid`, () => {
  let app;
  let db;
  let response;

  beforeAll(async () => {
    ({app, db} = await createAPI());
    response = await request(app).post(`/categories`).send(NEW_CATEGORY);
  });

  test(`Status Code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Return article that created`, () => {
    expect(response.body.title).toBe(NEW_CATEGORY.title);
  });
  test(`Categories count is changed`, () => request(app).get(`/categories`).expect((res) => expect(res.body.length).toBe(6)));

  afterAll(async () => {
    await db.close();
  });
});

describe(`API changes categories after PUT request`, () => {
  let app;
  let db;
  let response;

  beforeAll(async () => {
    ({app, db} = await createAPI());
    response = await request(app).put(`/categories/1`).send(NEW_CATEGORY);
  });

  test(`Status Code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Return category that updated`, () => expect(response.body.title).toEqual(NEW_CATEGORY.title));
  test(`Category is really changed`, () => request(app).get(`/categories/`).expect((res) => {
    expect(res.body[4].title).toBe(NEW_CATEGORY.title);
  }));
  test(`Categories count isn't changed`, () => request(app).get(`/categories`).expect((res) => expect(res.body.length).toBe(5)));

  afterAll(async () => {
    await db.close();
  });
});

describe(`API delete category after request`, () => {
  let app;
  let db;
  let response;

  beforeAll(async () => {
    ({app, db} = await createAPI());
    response = await request(app).delete(`/categories/3`);
  });

  test(`Status Code 204`, () => expect(response.statusCode).toBe(HttpCode.DELETED));
  test(`Category is really deleted`, () => request(app).get(`/categories/3`).expect((res) => expect(res.statusCode).toBe(HttpCode.NOT_FOUND)));
  test(`Category count is changed`, () => request(app).get(`/categories`).expect((res) => expect(res.body.length).toBe(4)));

  afterAll(async () => {
    await db.close();
  });
});
