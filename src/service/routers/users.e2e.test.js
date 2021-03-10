'use strict';

const express = require(`express`);
const request = require(`supertest`);
const bcrypt = require(`bcrypt`);

const usersRouter = require(`./users`);
const UserService = require(`../data-services/user`);

const mockLogger = require(`../middlewares/mock-logger`);

const DB = require(`../db`);
const refillDB = require(`../db/refill-db`);

const {HttpCode} = require(`../../consts`);

const mockData = require(`../../../data/mock-test-data`);

const NEW_USER = {
  firstName: `JestFirstName`,
  lastName: `JestLastName`,
  email: `jest@example.com`,
  password: `123456`,
  repeatPassword: `123456`
};

const NEW_INVALID_USER = {
  firstName: `Jest First Name`,
  lastName: `Jest Last Name`,
  email: `jest.com`,
  password: `12345`,
  repeatPassword: `123`
};

const createAPI = async () => {
  const db = new DB().getDB();
  await refillDB(db, mockData);

  const app = express();
  app.use(express.json());
  app.use(mockLogger);

  const userService = new UserService(db);
  app.use(`/users`, usersRouter(userService));
  return {app, db, userService};
};


describe(`API creates user if data is valid`, () => {
  let app;
  let db;
  let userService;
  let response;
  let userId;

  beforeAll(async () => {
    ({app, db, userService} = await createAPI());
    response = await request(app).post(`/users`).send(NEW_USER);
  });

  test(`Status Code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Return user with name and id`, () => {
    expect(response.body.firstName).toBe(NEW_USER.firstName);
    expect(response.body.lastName).toBe(NEW_USER.lastName);
    expect(response.body.id).toBeTruthy();
    userId = response.body.id;
  });
  test(`User is really created`, async () => {
    const user = await userService.getOne(userId);
    expect(user.firstName).toBe(NEW_USER.firstName);
    expect(user.lastName).toBe(NEW_USER.lastName);
    expect(user.email).toBe(NEW_USER.email);
    expect(bcrypt.compareSync(NEW_USER.password, user.password)).toBeTruthy();
  });

  afterAll(async () => {
    await db.close();
  });
});

describe(`API returns 400 if user data is invalid`, () => {
  let app;
  let db;

  beforeAll(async () => {
    ({app, db} = await createAPI());
  });

  test(`Status Code 400 if fields are missing`, async () => {
    for (const key of Object.keys(NEW_USER)) {
      const badUser = {...NEW_USER};
      delete badUser[key];
      await request(app)
        .post(`/users`)
        .send(badUser)
        .expect((res) => expect(res.statusCode).toBe(HttpCode.BAD_REQUEST));
    }
  });
  test(`There are 5 errors if user is invalid`, async () => {
    await request(app)
      .post(`/users`)
      .send(NEW_INVALID_USER)
      .expect((res) => expect(res.body.error.details.length).toBe(5));
  });

  afterAll(async () => {
    await db.close();
  });
});
