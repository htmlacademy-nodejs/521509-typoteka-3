# Личный проект «Типотека»

Личный проект по курсу [HTML академии](https://htmlacademy.ru/) 
<b>Node.js. Разработка серверов приложений и API.</b>

###О проекте
«Типотека» — приложение для быстрого создания персональных блогов. Несколько простых шагов и вы автор современной площадки для публикации заметок. «Типотека» — это не только создание контента. Любой желающий читатель может зарегистрироваться и оставить комментарии. Создавайте заметки, общайтесь с читателями, модерируйте контент вместе с «Типотека».

* Студент: [Александр Кригер](https://up.htmlacademy.ru/nodejs/3/user/521509).
* Наставник: [Никита Куцелай](https://htmlacademy.ru/profile/id32750).

## Запуск проекта
Требования по окружению
* node.js 14.15.4 LTS
* PostgreSQL 12



### Инициализация приложения
1. Создаем файл `.env` в корне по аналогии с `.env.example`. 
Для работы вебсокетов, нужно также обновить данные для подключения в `./src/express/public/js/data-uploader.js`


2. Устанавливаем зависимости
```
npm install
```


### Настройка БД
3. Создание баз (основной и для тестов).
```
psql -U postgres -W -h localhost -a -f create-db.sql
psql -U postgres -W -h localhost -a -f create-test-db.sql
```

4. Коннектимся к серверу
```
psql -U postgres -W -h localhost
```

5. Создание пользователей для основной и тестовой базы. <b>!не используй пароль по умолчанию!</b>
```
CREATE USER "typoteka_user" WITH ENCRYPTED PASSWORD 'password';
CREATE USER "typoteka_test_user" WITH ENCRYPTED PASSWORD 'password';
```

6. Выдаем доступ к базе для созданного пользователя
```
GRANT ALL PRIVILEGES ON DATABASE "typoteka" TO "typoteka_user"; 
GRANT ALL PRIVILEGES ON DATABASE "typoteka_test" TO "typoteka_test_user"; 
```

7. Отключаемся от базы `\q`.

8. Выполняем все необходимые миграции.
```
npm run migrate:all
```

9. При необходимости наполняем тестовыми данными. <b>Это операция сотрет данные, если он были добавлены</b>.
Можно менять количество добавляемых статей последним параметром.
```
node ./src/service/service.js --generate 20
```
Если данные были сгенерированы таким образом, то вот доступы для автора и читателя:
```
Автор
email: example@example.com
password: 123456

Читатель
email: example1@example.com
password: 123456
```

10. Запускаем тесты.
```
npm run test
```

### Старт приложения
11. Запускаем API сервис
```
npm run start
```

##Схема БД
Подробная схема sql лежит в `/schema.sql`

![Схема БД](data/shema.jpg?raw=true "Схема БД")
