DROP TABLE IF EXISTS articles_categories;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

CREATE TABLE categories
(
  id SERIAL PRIMARY KEY,
-- Согласно ТЗ категория - Минимум 5 символов. Максимум 30
  title VARCHAR(30) NOT NULL UNIQUE,

-- timestamps от sequelize
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

CREATE TABLE users
(
  id SERIAL PRIMARY KEY,
  avatar_url VARCHAR(255),
-- кол-во адекватных символов из google
  first_name VARCHAR(35) NOT NULL,
  last_name VARCHAR(35) NOT NULL,
  email VARCHAR(254) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,

-- timestamps от sequelize
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

CREATE TABLE articles
(
  id SERIAL PRIMARY KEY,
--  длина заголовка и анонса согласно ТЗ 250 символов
  title VARCHAR(250) NOT NULL,
  announce VARCHAR(250) NOT NULL,
--  длина текста согласно ТЗ 1000 символов, и поле является не обязательным(!?)
  text VARCHAR(1000),
  published_at TIMESTAMPTZ NOT NULL,
  image VARCHAR(255),
  user_id INTEGER NOT NULL,

-- при удалении автора удаляем все его статьи (автор по ТЗ один, так что можно сказать, что удаляется весь блог
  FOREIGN KEY (user_id) REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,

-- timestamps от sequelize
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

CREATE TABLE comments
(
  id SERIAL PRIMARY KEY,
-- комментарий не ограничен по количеству символов согласно ТЗ, но он точно не может быть больше максимальной статьи.
  text VARCHAR(1000) NOT NULL,
  article_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,

-- при удалении статьи комментарии больше не нужны.
  FOREIGN KEY (article_id) REFERENCES articles(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
-- при удалении пользователя его комментарии лучше оставить (не забыть учесть в шаблоне, что user мб null)
  FOREIGN KEY (user_id) REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE SET NULL,

-- timestamps от sequelize
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

CREATE TABLE articles_categories
(
  article_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  CONSTRAINT articles_categories_pk PRIMARY KEY (article_id, category_id),

-- удаляем связи при удалении категории или статьи
  FOREIGN KEY (article_id) REFERENCES articles(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,

-- timestamps от sequelize
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  deleted_at TIMESTAMPTZ DEFAULT NULL
);
