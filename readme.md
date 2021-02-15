# Личный проект «Типотека» [![Build status][travis-image]][travis-url]

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

### Настройка БД
<b>Тут появится настройка БД после подключения sequelize</b>

Создание базы
```
psql -U postgres -W -h localhost -a -f create-db.sql
```

Коннектимся к серверу
```
psql -U postgres -W -h localhost
```

Создание пользователя. <b>!не используй пароль по умолчанию!</b> 
```
CREATE USER "typoteka_user" WITH ENCRYPTED PASSWORD 'password';
```

Выдаем доступ к базе для созданного пользователя
```
GRANT ALL PRIVILEGES ON DATABASE "typoteka" TO "typoteka_user"; 
```

Отключаемся от базы и коннектимся новым пользователем и втягиваем схему
```
\q
psql -U typoteka_user -W -h localhost -d typoteka  -a -f schema.sql
```

Наполняем тестовыми данными. <b>Это операция сотрет данные, если он были добавлены</b>
```
psql -U typoteka_user -W -h localhost -d typoteka  -a -f fill-db.sql
```

### Запуск приложения
1. Создаем файл `.env` в корне по аналогии с `.env.example`

2. Устанавливаем зависимости
```
npm install
```
3. Запускаем API сервис
```
npm run start
```
4. В соседнем терминале запускаем фронт сервис
```
npm run start-front-server
```

##Схема БД
Подробная схема sql лежит в `/schema.sql`

![Схема БД](data/shema.jpg?raw=true "Схема БД")
