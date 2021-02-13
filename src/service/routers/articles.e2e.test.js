'use strict';

const express = require(`express`);
const request = require(`supertest`);
const lodash = require(`lodash`);

const articleRouter = require(`./articles`);
const ArticleService = require(`../data-services/article`);
const CommentService = require(`../data-services/comment`);

const {HttpCode} = require(`../../consts`);

const mockArticles = require(`../../../data/mock-test-data`).articles;

const NEW_ARTICLE = {
  title: `Article form JEST`,
  announce: `JEST can create articles`,
  text: `Достичь успеха помогут ежедневные повторения. Собрать камни бесконечности легко, если вы прирожденный герой. Программировать не настолько сложно, как об этом говорят.`,
  categories: [
    `IT`,
    `Деревья`
  ]
};

const NEW_COMMENT = {
  text: `Comment from JEST`,
};

const createAPI = () => {
  const app = express();
  app.use(express.json());

  const clonedMockData = lodash.cloneDeep(mockArticles);
  app.use(`/articles`, articleRouter(new ArticleService(clonedMockData), new CommentService()));
  return app;
};


describe(`API returns all articles`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = createAPI();
    response = await request(app).get(`/articles`);
  });

  test(`Status Code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Return array with 5 items`, () => expect(response.body.length).toBe(5));
  test(`First item id is 2H0r`, () => expect(response.body[0].id).toBe(`2H0r`));
});

describe(`API returns right article Id`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = createAPI();
    response = await request(app).get(`/articles/hQq0`);
  });

  test(`Status Code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Item id is hQq0`, () => expect(response.body.id).toBe(`hQq0`));
  test(`Item title is Как собрать камни бесконечности`, () => expect(response.body.title).toBe(`Как собрать камни бесконечности`));
});

describe(`API creates an article if data is valid`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = createAPI();
    response = await request(app).post(`/articles`).send(NEW_ARTICLE);
  });

  test(`Status Code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Return article that created`, () => expect(response.body).toEqual(expect.objectContaining(NEW_ARTICLE)));
  test(`Articles count is changed`, () => request(app).get(`/articles`).expect((res) => expect(res.body.length).toBe(6)));
});

describe(`API returns 400 if posting article is invalid`, () => {
  let app;

  beforeAll(async () => {
    app = createAPI();
  });

  test(`Status Code 400`, async () => {
    for (const key of Object.keys(NEW_ARTICLE)) {
      const badArticle = {...NEW_ARTICLE};
      delete badArticle[key];
      await request(app)
        .post(`/articles`)
        .send(badArticle)
        .expect((res) => expect(res.statusCode).toBe(HttpCode.BAD_REQUEST));
    }
  });
  test(`Articles count isn't changed`, () => request(app).get(`/articles`).expect((res) => expect(res.body.length).toBe(5)));
});

describe(`API changes article after PUT request`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = createAPI();
    response = await request(app).put(`/articles/hQq0`).send(NEW_ARTICLE);
  });

  test(`Status Code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Return article that updated`, () => expect(response.body).toEqual(expect.objectContaining(NEW_ARTICLE)));
  test(`Article is really changed`, () => request(app).get(`/articles/hQq0`).expect((res) => expect(res.body).toEqual(expect.objectContaining(NEW_ARTICLE))));
  test(`Articles count isn't changed`, () => request(app).get(`/articles`).expect((res) => expect(res.body.length).toBe(5)));
});

describe(`API returns 404 on not existing article`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = createAPI();
    response = await request(app).put(`/articles/21221`).send(NEW_ARTICLE);
  });

  test(`Status Code 404`, () => expect(response.statusCode).toBe(HttpCode.NOT_FOUND));
  test(`Returns error with message`, () => expect(response.body.error.message).toBe(`Article doesn't exist`));
  test(`Articles count isn't changed`, () => request(app).get(`/articles`).expect((res) => expect(res.body.length).toBe(5)));
});

describe(`API returns 400 on updating on invalid article`, () => {
  let app;

  beforeAll(async () => {
    app = createAPI();
  });

  test(`Status Code 400`, async () => {
    for (const key of Object.keys(NEW_ARTICLE)) {
      const badArticle = {...NEW_ARTICLE};
      delete badArticle[key];
      await request(app)
        .put(`/articles/hQq0`)
        .send(badArticle)
        .expect((res) => expect(res.statusCode).toBe(HttpCode.BAD_REQUEST));
    }
  });
  test(`Articles count isn't changed`, () => request(app).get(`/articles`).expect((res) => expect(res.body.length).toBe(5)));
});

describe(`API delete article after request`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = createAPI();
    response = await request(app).delete(`/articles/hQq0`);
  });

  test(`Status Code 204`, () => expect(response.statusCode).toBe(HttpCode.DELETED));
  test(`Article is really deleted`, () => request(app).get(`/articles/hQq0`).expect((res) => expect(res.statusCode).toBe(HttpCode.NOT_FOUND)));
  test(`Articles count is changed`, () => request(app).get(`/articles`).expect((res) => expect(res.body.length).toBe(4)));
});

describe(`API get article's comments`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = createAPI();
    response = await request(app).get(`/articles/hQq0/comments`);
  });

  test(`Status Code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`There is 1 comment`, () => expect(response.body.length).toBe(1));
  test(`Comment id is o1O2`, () => expect(response.body[0].id).toBe(`o1O2`));
});

describe(`API delete comment`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = createAPI();
    response = await request(app).delete(`/articles/hQq0/comments/o1O2`);
  });

  test(`Status Code 204`, () => expect(response.statusCode).toBe(HttpCode.DELETED));
  test(`Comments count is changed`, () => request(app).get(`/articles/hQq0/comments`).expect((res) => expect(res.body.length).toBe(0)));
  test(`Comments is really deleted`, () => request(app).get(`/articles/hQq0/comments`).expect((res) => {
    let isCommentIdExist = false;
    for (const comment of res.body) {
      if (comment[`id`] === `o1O2`) {
        isCommentIdExist = true;
      }
    }
    expect(isCommentIdExist).toBeFalsy();
  }));
});

describe(`API delete comment doesn't exist`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = createAPI();
    response = await request(app).delete(`/articles/hQq0/comments/R4CPA212`);
  });

  test(`Status Code 404`, () => expect(response.statusCode).toBe(HttpCode.NOT_FOUND));
  test(`Comments count isn't changed`, () => request(app).get(`/articles/hQq0/comments`).expect((res) => expect(res.body.length).toBe(1)));
});

describe(`API add comments to article`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = createAPI();
    response = await request(app).post(`/articles/hQq0/comments/`).send(NEW_COMMENT);
  });

  test(`Status Code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Return comment that created`, () => expect(response.body).toEqual(expect.objectContaining(NEW_COMMENT)));
  test(`Comments is really added`, () => request(app).get(`/articles/hQq0/comments/`).expect((res) => {
    let addedComment = {};
    for (const comment of res.body) {
      if (comment.text === NEW_COMMENT.text) {
        addedComment = comment;
      }
    }
    expect(addedComment).toEqual(expect.objectContaining(addedComment));
  }));
  test(`Comments count is changed`, () => request(app).get(`/articles/hQq0/comments/`).expect((res) => expect(res.body.length).toBe(2)));
});

describe(`API returns 400 if posting comment article is without any key`, () => {
  let app;

  beforeAll(async () => {
    app = createAPI();
  });

  test(`Status Code 400`, async () => {
    for (const key of Object.keys(NEW_COMMENT)) {
      const badComment = {...NEW_COMMENT};
      delete badComment[key];
      await request(app)
        .post(`/articles/hQq0/comments/`)
        .send(badComment)
        .expect((res) => expect(res.statusCode).toBe(HttpCode.BAD_REQUEST));
    }
  });
  test(`article's comments count isn't changed`, () => request(app).get(`/articles/hQq0/comments/`).expect((res) => expect(res.body.length).toBe(1)));
});
