'use strict';

const express = require(`express`);
const request = require(`supertest`);

const articleRouter = require(`./articles`);
const ArticleService = require(`../data-services/article`);
const CommentService = require(`../data-services/comment`);

const mockLogger = require(`../middlewares/mock-logger`);

const DB = require(`../db`);
const refillDB = require(`../db/refill-db`);

const {HttpCode} = require(`../../consts`);

const mockData = require(`../../../data/mock-test-data`);

const JWTHelper = require(`../lib/jwt-helper`);

const NEW_ARTICLE = {
  title: `Article form JEST, it can be fantastic`,
  announce: `JEST can create articles. This is article announce.`,
  publishedAt: `2021-02-18T06:21:06.102Z`,
  categories: [1]
};

const NEW_INVALID_ARTICLE = {
  title: `Too short`,
  announce: `Too short`,
  publishedAt: `2021/12/12`,
  categories: `a`
};

const NEW_COMMENT = {
  text: `Comment from JEST. Here is at least 20 symbols`,
};

const NEW_INVALID_COMMENT = {
  text: `Too short`,
};

const AUTHOR_FOR_TOKEN = {
  id: 1,
  firstName: `Инокентий`,
  lastName: `Иванов`,
  isAuthor: true
};

const READER_FOR_TOKEN = {
  id: 1,
  firstName: `Инокентий`,
  lastName: `Иванов`,
  isAuthor: false
};


const createAPI = async () => {
  const db = new DB().getDB();
  await refillDB(db, mockData);

  const app = express();
  app.use(express.json());
  app.use(mockLogger);

  const articleService = new ArticleService(db);
  const commentService = new CommentService(db);

  app.use(`/articles`, articleRouter(new ArticleService(db), new CommentService(db)));
  return {app, db, articleService, commentService};
};


describe(`API returns all articles`, () => {
  let app;
  let db;
  let response;

  beforeAll(async () => {
    ({app, db} = await createAPI());
    response = await request(app).get(`/articles`);
  });

  test(`Status Code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Return array with 5 items`, () => {
    expect(response.body.articles.length).toBe(5);
    expect(response.body.count).toBe(5);
  });
  test(`Items are ordered by publishedAt`, () => {
    expect(response.body.articles[0].title).toBe(`Что такое золотое сечение`);
    expect(response.body.articles[3].title).toBe(`Что такое старость и когда она наступает`);
  });

  afterAll(async () => {
    await db.close();
  });
});

describe(`API returns right article Id`, () => {
  let app;
  let db;
  let response;

  beforeAll(async () => {
    ({app, db} = await createAPI());
    response = await request(app).get(`/articles/3`);
  });

  test(`Status Code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Item id is 3`, () => expect(response.body.id).toBe(3));

  afterAll(async () => {
    await db.close();
  });
});

describe(`API creates an article if data is valid`, () => {
  let app;
  let db;
  let response;
  let articleService;

  beforeAll(async () => {
    ({app, db, articleService} = await createAPI());
    response = await request(app)
      .post(`/articles`)
      .set(`Authorization`, `Bearer ${JWTHelper.generateTokens(AUTHOR_FOR_TOKEN).accessToken}`)
      .send(NEW_ARTICLE);
  });

  test(`Status Code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Return article that created`, () => {
    expect(response.body.title).toBe(NEW_ARTICLE.title);
    expect(response.body.announce).toBe(NEW_ARTICLE.announce);
    expect(response.body.publishedAt).toBe(NEW_ARTICLE.publishedAt);
  });
  test(`Articles count is changed`, async () => {
    const {articles} = await articleService.getAll();
    expect(articles.length).toBe(6);
  });

  afterAll(async () => {
    await db.close();
  });
});

describe(`API doesn't create an article if user isn't author`, () => {
  let app;
  let db;
  let articleService;
  let response;

  beforeAll(async () => {
    ({app, db, articleService} = await createAPI());
    response = await request(app)
      .post(`/articles`)
      .set(`Authorization`, `Bearer ${JWTHelper.generateTokens(READER_FOR_TOKEN).accessToken}`)
      .send(NEW_ARTICLE);
  });

  test(`Status Code 403`, () => expect(response.statusCode).toBe(HttpCode.FORBIDDEN));
  test(`Articles count isn't changed`, async () => {
    const {articles} = await articleService.getAll();
    expect(articles.length).toBe(5);
  });

  afterAll(async () => {
    await db.close();
  });
});

describe(`API returns 400 if posting article is invalid`, () => {
  let app;
  let db;
  let articleService;

  beforeAll(async () => {
    ({app, db, articleService} = await createAPI());
  });

  test(`Status Code 400 if fields are missing`, async () => {
    for (const key of Object.keys(NEW_ARTICLE)) {
      const badArticle = {...NEW_ARTICLE};
      delete badArticle[key];
      await request(app)
        .post(`/articles`)
        .send(badArticle)
        .set(`Authorization`, `Bearer ${JWTHelper.generateTokens(AUTHOR_FOR_TOKEN).accessToken}`)
        .expect((res) => expect(res.statusCode).toBe(HttpCode.BAD_REQUEST));
    }
  });
  test(`There are 4 errors if article is invalid`, async () => {
    await request(app)
        .post(`/articles`)
        .send(NEW_INVALID_ARTICLE)
        .set(`Authorization`, `Bearer ${JWTHelper.generateTokens(AUTHOR_FOR_TOKEN).accessToken}`)
        .expect((res) => expect(res.body.error.details.length).toBe(4));
  });
  test(`Articles count isn't changed`, async () => {
    const {articles} = await articleService.getAll();
    expect(articles.length).toBe(5);
  });

  afterAll(async () => {
    await db.close();
  });
});

describe(`API changes article after PUT request`, () => {
  let app;
  let db;
  let response;
  let articleService;

  beforeAll(async () => {
    ({app, db, articleService} = await createAPI());
    response = await request(app)
      .put(`/articles/1`)
      .set(`Authorization`, `Bearer ${JWTHelper.generateTokens(AUTHOR_FOR_TOKEN).accessToken}`)
      .send(NEW_ARTICLE);
  });

  test(`Status Code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Return article that updated`, () => expect(response.body.title).toEqual(NEW_ARTICLE.title));
  test(`Article is really changed`, async () => {
    const article = await articleService.getOne(1);
    expect(article.title).toBe(NEW_ARTICLE.title);
    expect(article.announce).toBe(NEW_ARTICLE.announce);
    expect(new Date(article.publishedAt).toISOString()).toEqual(NEW_ARTICLE.publishedAt);
  });
  test(`Articles count isn't changed`, async () => {
    const {articles} = await articleService.getAll();
    expect(articles.length).toBe(5);
  });

  afterAll(async () => {
    await db.close();
  });
});

describe(`API doesn't change article after PUT request if user is not author`, () => {
  let app;
  let db;
  let response;

  beforeAll(async () => {
    ({app, db} = await createAPI());
    response = await request(app)
      .put(`/articles/1`)
      .set(`Authorization`, `Bearer ${JWTHelper.generateTokens(READER_FOR_TOKEN).accessToken}`)
      .send(NEW_ARTICLE);
  });

  test(`Status Code 403`, () => expect(response.statusCode).toBe(HttpCode.FORBIDDEN));

  afterAll(async () => {
    await db.close();
  });
});


describe(`API returns 404 on not existing article`, () => {
  let app;
  let db;
  let response;
  let articleService;

  beforeAll(async () => {
    ({app, db, articleService} = await createAPI());
    response = await request(app)
      .put(`/articles/21221`)
      .set(`Authorization`, `Bearer ${JWTHelper.generateTokens(AUTHOR_FOR_TOKEN).accessToken}`)
      .send(NEW_ARTICLE);
  });

  test(`Status Code 404`, () => expect(response.statusCode).toBe(HttpCode.NOT_FOUND));
  test(`Returns error with message`, () => expect(response.body.error.message).toBe(`Article doesn't exist`));
  test(`Articles count isn't changed`, async () => {
    const {articles} = await articleService.getAll();
    expect(articles.length).toBe(5);
  });

  afterAll(async () => {
    await db.close();
  });
});

describe(`API returns 400 on updating on invalid article`, () => {
  let app;
  let db;

  beforeAll(async () => {
    ({app, db} = await createAPI());
  });

  test(`Status Code 400`, async () => {
    for (const key of Object.keys(NEW_ARTICLE)) {
      const badArticle = {...NEW_ARTICLE};
      delete badArticle[key];
      await request(app)
        .put(`/articles/1`)
        .set(`Authorization`, `Bearer ${JWTHelper.generateTokens(AUTHOR_FOR_TOKEN).accessToken}`)
        .send(badArticle)
        .expect((res) => expect(res.statusCode).toBe(HttpCode.BAD_REQUEST));
    }
  });
  test(`There are 4 errors if article is invalid`, async () => {
    await request(app)
      .put(`/articles/1`)
      .set(`Authorization`, `Bearer ${JWTHelper.generateTokens(AUTHOR_FOR_TOKEN).accessToken}`)
      .send(NEW_INVALID_ARTICLE)
      .expect((res) => expect(res.body.error.details.length).toBe(4));
  });

  afterAll(async () => {
    await db.close();
  });
});

describe(`API delete article after request`, () => {
  let app;
  let db;
  let response;
  let articleService;

  beforeAll(async () => {
    ({app, db, articleService} = await createAPI());
    response = await request(app)
      .delete(`/articles/3`)
      .set(`Authorization`, `Bearer ${JWTHelper.generateTokens(AUTHOR_FOR_TOKEN).accessToken}`);
  });

  test(`Status Code 204`, () => expect(response.statusCode).toBe(HttpCode.DELETED));
  test(`API returns 404 now for this id.`, () => request(app).get(`/articles/3`).expect((res) => expect(res.statusCode).toBe(HttpCode.NOT_FOUND)));
  test(`Article is really deleted`, async () => {
    const {articles} = await articleService.getAll();
    const deletedArticle = articles.find((it)=> it.id === 3);
    expect(deletedArticle).toBeFalsy();
  });
  test(`Articles count is changed`, async () => {
    const {articles} = await articleService.getAll();
    expect(articles.length).toBe(4);
  });

  afterAll(async () => {
    await db.close();
  });
});

describe(`API doesn't delete article after request if user is not author`, () => {
  let app;
  let db;
  let response;
  let articleService;

  beforeAll(async () => {
    ({app, db, articleService} = await createAPI());
    response = await request(app)
      .delete(`/articles/3`)
      .set(`Authorization`, `Bearer ${JWTHelper.generateTokens(READER_FOR_TOKEN).accessToken}`);
  });

  test(`Status Code for deleting is 403`, () => expect(response.statusCode).toBe(HttpCode.FORBIDDEN));
  test(`Articles count isn't changed`, async () => {
    const {articles} = await articleService.getAll();
    expect(articles.length).toBe(5);
  });

  afterAll(async () => {
    await db.close();
  });
});

describe(`API get article's comments`, () => {
  let app;
  let db;
  let response;
  let articleService;
  let article;

  beforeAll(async () => {
    ({app, db, articleService} = await createAPI());
    response = await request(app).get(`/articles/2/comments`);
    article = await articleService.getOne(2);
  });

  test(`Status Code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`There are right comments`, () => expect(response.body.map((comment) => comment.text)).toEqual(article.comments.map((comment) => comment.text)));

  afterAll(async () => {
    await db.close();
  });
});

describe(`API delete comment`, () => {
  let app;
  let db;
  let response;
  let articleService;
  let commentId;
  let commentService;

  beforeAll(async () => {
    ({app, db, articleService, commentService} = await createAPI());
    const article = await articleService.getOne(2);
    commentId = article.comments[0].id;

    response = await request(app)
      .delete(`/articles/2/comments/${commentId}`)
      .set(`Authorization`, `Bearer ${JWTHelper.generateTokens(AUTHOR_FOR_TOKEN).accessToken}`);
  });

  test(`Status Code 204`, () => expect(response.statusCode).toBe(HttpCode.DELETED));
  test(`Comments count is changed`, () => request(app).get(`/articles/2/comments`).expect((res) => expect(res.body.length).toBe(0)));
  test(`Comments count is changed`, async () => {
    const article = await articleService.getOne(2);
    expect(article.comments.length).toBe(0);
  });
  test(`Comments is really deleted`, async () => {
    try {
      await commentService.getOne(commentId);
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  afterAll(async () => {
    await db.close();
  });
});

describe(`API doesn't delete comment if user is not author`, () => {
  let app;
  let db;
  let response;
  let articleService;
  let commentId;

  beforeAll(async () => {
    ({app, db, articleService} = await createAPI());
    const article = await articleService.getOne(2);
    commentId = article.comments[0].id;

    response = await request(app)
      .delete(`/articles/2/comments/${commentId}`)
      .set(`Authorization`, `Bearer ${JWTHelper.generateTokens(READER_FOR_TOKEN).accessToken}`);
  });

  test(`Status Code 403`, () => expect(response.statusCode).toBe(HttpCode.FORBIDDEN));

  afterAll(async () => {
    await db.close();
  });
});

describe(`API doesn't delete comment doesn't exist`, () => {
  let app;
  let db;
  let response;

  beforeAll(async () => {
    ({app, db} = await createAPI());
    response = await request(app)
      .delete(`/articles/2/comments/113`)
      .set(`Authorization`, `Bearer ${JWTHelper.generateTokens(AUTHOR_FOR_TOKEN).accessToken}`);
  });

  test(`Status Code 404`, () => expect(response.statusCode).toBe(HttpCode.NOT_FOUND));

  afterAll(async () => {
    await db.close();
  });
});

describe(`API add comments to article`, () => {
  let app;
  let db;
  let response;
  let articleService;
  let article;

  beforeAll(async () => {
    ({app, db, articleService} = await createAPI());
    article = await articleService.getOne(2);
    response = await request(app)
      .post(`/articles/2/comments/`)
      .set(`Authorization`, `Bearer ${JWTHelper.generateTokens(READER_FOR_TOKEN).accessToken}`)
      .send(NEW_COMMENT);
  });

  test(`Status Code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Return comment that created`, () => expect(response.body).toEqual(expect.objectContaining(NEW_COMMENT)));
  test(`Comments is really added`, async () => {
    const articleWithNewComment = await articleService.getOne(2);
    expect(articleWithNewComment.comments.length).toBe(article.comments.length + 1);
  });

  afterAll(async () => {
    await db.close();
  });
});

describe(`API returns 400 if posting invalid comment article`, () => {
  let app;
  let db;
  let articleService;
  let article;

  beforeAll(async () => {
    ({app, db, articleService} = await createAPI());
    article = await articleService.getOne(2);
  });

  test(`Status Code 400`, async () => {
    for (const key of Object.keys(NEW_COMMENT)) {
      const badComment = {...NEW_COMMENT};
      delete badComment[key];
      await request(app)
        .post(`/articles/2/comments/`)
        .send(badComment)
        .expect((res) => expect(res.statusCode).toBe(HttpCode.BAD_REQUEST));
    }
  });
  test(`There are 1 errors if comment is invalid`, async () => {
    await request(app)
      .post(`/articles/2/comments/`)
      .set(`Authorization`, `Bearer ${JWTHelper.generateTokens(READER_FOR_TOKEN).accessToken}`)
      .send(NEW_INVALID_COMMENT)
      .expect((res) => expect(res.body.error.details.length).toBe(1));
  });
  test(`Article's comments count isn't changed`, async () => {
    const articleAfterRequests = await articleService.getOne(2);
    expect(articleAfterRequests.comments).toEqual(article.comments);
  });

  afterAll(async () => {
    await db.close();
  });
});
