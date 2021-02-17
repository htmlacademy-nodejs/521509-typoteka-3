--Получить список всех категорий (идентификатор, наименование категории);
SELECT
  id,
  title
FROM categories;

--Получить список категорий для которых создана минимум одна публикация (идентификатор, наименование категории);
SELECT
  id,
  title
FROM categories
INNER JOIN articles_categories ON categories.id = articles_categories.category_id
GROUP BY categories.id
ORDER BY categories.id;

--Получить список категорий с количеством публикаций (идентификатор, наименование категории, количество публикаций в категории);
SELECT
  id,
  title,
  COUNT(id) as articles_count
FROM categories
INNER JOIN articles_categories ON categories.id = articles_categories.category_id
GROUP BY categories.id
ORDER BY articles_count DESC;

--Получить список публикаций (идентификатор публикации, заголовок публикации, анонс публикации, дата публикации, имя и фамилия автора, контактный email, количество комментариев, наименование категорий). Сначала свежие публикации;
-- создаем представление для этой задачи, перед этим удаляем старое представление, если было
DROP VIEW IF EXISTS articles_with_advanced_info;
CREATE VIEW articles_with_advanced_info AS
  SELECT
    articles.id,
    articles.title,
    articles.announce,
    articles.published_at,
    users.first_name,
    users.last_name,
    users.email,
    comments.comments_count,
    categories.categories_titles
  FROM articles
  INNER JOIN users ON articles.user_id = users.id
  LEFT JOIN (
    SELECT
      article_id,
      COUNT (article_id) AS comments_count
    FROM comments
    GROUP BY article_id
  ) AS comments ON articles.id = comments.article_id
  INNER JOIN (
    SELECT
      article_id,
      STRING_AGG(categories.title, ', ') AS categories_titles
    FROM articles_categories
    INNER JOIN categories ON articles_categories.category_id = categories.id
    GROUP BY article_id
  ) AS categories ON articles.id = categories.article_id
  ORDER BY articles.published_at DESC
  ;

-- сам запрос
SELECT
  *
FROM articles_with_advanced_info;

--Получить полную информацию определённой публикации (идентификатор публикации, заголовок публикации, анонс, полный текст публикации, дата публикации, путь к изображению, имя и фамилия автора, контактный email, количество комментариев, наименование категорий);
-- используем ранее созданное представление
-- для примера id = 2;
SELECT
  *
FROM articles_with_advanced_info
WHERE id = 2;

--Получить список из 5 свежих комментариев (идентификатор комментария, идентификатор публикации, имя и фамилия автора, текст комментария);
SELECT
  comments.id,
  comments.article_id,
  users.first_name,
  users.last_name,
  comments.text,
  -- добавляем дату создания для проверки
  comments.created_at
FROM comments
INNER JOIN users ON comments.user_id = users.id
ORDER BY comments.created_at DESC
LIMIT 5;

--Получить список комментариев для определённой публикации (идентификатор комментария, идентификатор публикации, имя и фамилия автора, текст комментария). Сначала новые комментарии;
--для примера id = 3
SELECT
  comments.id,
  comments.article_id,
  users.first_name,
  users.last_name,
  comments.text,
  -- добавляем дату создания для проверки
  comments.created_at
FROM comments
INNER JOIN users ON comments.user_id = users.id
WHERE comments.article_id = 2
ORDER BY comments.created_at DESC;


--Обновить заголовок определённой публикации на «Как я встретил Новый год»;
UPDATE articles
SET
  title = 'Как я встретил Новый год'
WHERE articles.id = 1;
