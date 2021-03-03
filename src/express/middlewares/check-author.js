'use strict';

/**
 * Проверка res.locals, что пользователь является автором блога.
 */

module.exports = async (req, res, next) => {


  // проверяем автор ли пользователь, если нет, перенаправляем на главную
  if (!res.locals.user || !res.locals.user.isAuthor) {
    res.redirect(`/`);
    return;
  }

  // если проверка прошла пропускаем дальше
  next();
};
