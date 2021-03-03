'use strict';

const express = require(`express`);
const request = require(`supertest`);

const authRouter = require(`./auth`);
const UserService = require(`../data-services/user`);
const JWTHelper = require(`../lib/jwt-helper`);

const mockLogger = require(`../middlewares/mock-logger`);

const DB = require(`../db`);
const refillDB = require(`../db/refill-db`);

const {HttpCode} = require(`../../consts`);

const mockData = require(`../../../data/mock-test-data`);

const USER = {
  email: `example@example.com`,
  password: `123456`,
};

const USER_WITH_WRONG_PASS = {
  email: `example@example.com`,
  password: `1234516`,
};

const USER_WITH_WRONG_EMAIL = {
  email: `exampl@example.com`,
  password: `123456`,
};

const USER_FOR_TOKEN = {
  id: 1,
  firstName: `Инокентий`,
  lastName: `Иванов`,
  isAuthor: false
};

const INVALID_REFRESH_TOKEN = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjo2LCJmaXJzdE5hbWUiOiLQmNC70YzRjyIsImxhc3ROYW1lIjoi0JLQsNGA0LvQsNC80L7QsiIsImF2YXRhciI6bnVsbCwiaXNBdXRob3IiOm51bGx9LCJpYXQiOjE2MTQ1NzA0MzAsImV4cCI6MTYxNDYyNDQzMH0.K4ViZjlkoB-hCYjDpg-baeZEByeeeeoiigzyYJjO_957S2Q`;

const createAPI = async () => {
  const db = new DB().getDB();
  await refillDB(db, mockData);

  const app = express();
  app.use(express.json());
  app.use(mockLogger);

  app.use(`/auth`, authRouter(new UserService(db)));
  return {app, db};
};


describe(`API auth user if data is ok`, () => {
  let app;
  let db;
  let response;

  beforeAll(async () => {
    ({app, db} = await createAPI());
    response = await request(app).post(`/auth`).send(USER);
  });

  test(`Status Code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Return valid tokens with user with name and id`, async () => {
    const user = await JWTHelper.verifyToken(response.body.accessToken);
    expect(user.firstName).toBe(`Инокентий`);
    expect(user.lastName).toBe(`Иванов`);
    expect(user.id).toBe(1);
    expect(user.isAuthor).toBeTruthy();
  });
  test(`Refresh token is valid`, async () => {
    expect(JWTHelper.refreshAccessToken(response.body.refreshToken)).toBeTruthy();
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
    for (const key of Object.keys(USER)) {
      const badUser = {...USER};
      delete badUser[key];
      await request(app)
        .post(`/auth`)
        .send(badUser)
        .expect((res) => expect(res.statusCode).toBe(HttpCode.BAD_REQUEST));
    }
  });

  test(`Status Code 400 if password is wrong`, async () => {
    await request(app)
      .post(`/auth`)
      .send(USER_WITH_WRONG_PASS)
      .expect((res) => expect(res.statusCode).toBe(HttpCode.BAD_REQUEST));
  });

  test(`Status Code 400 if email is wrong`, async () => {
    await request(app)
      .post(`/auth`)
      .send(USER_WITH_WRONG_EMAIL)
      .expect((res) => expect(res.statusCode).toBe(HttpCode.BAD_REQUEST));
  });

  afterAll(async () => {
    await db.close();
  });
});

describe(`API refresh if data is ok`, () => {
  let app;
  let db;
  let response;

  const {refreshToken} = JWTHelper.generateTokens(USER_FOR_TOKEN);

  beforeAll(async () => {
    ({app, db} = await createAPI());
    response = await request(app).post(`/auth/refresh`).send({refreshToken});
  });

  test(`Status Code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Return new valid tokens with user with name and id`, async () => {
    const user = await JWTHelper.verifyToken(response.body.accessToken);
    expect(user.firstName).toBe(`Инокентий`);
    expect(user.lastName).toBe(`Иванов`);
    expect(user.id).toBe(1);
    expect(user.isAuthor).toBeFalsy();
  });
  test(`Refresh token is valid`, async () => {
    expect(JWTHelper.refreshAccessToken(response.body.refreshToken)).toBeTruthy();
  });

  afterAll(async () => {
    await db.close();
  });
});

describe(`API doesn't refresh if refreshToken has invalid hash`, () => {
  let app;
  let db;
  let response;

  beforeAll(async () => {
    ({app, db} = await createAPI());
    response = await request(app).post(`/auth/refresh`).send({refreshToken: INVALID_REFRESH_TOKEN});
  });

  test(`Status Code 400`, () => expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));

  afterAll(async () => {
    await db.close();
  });
});
