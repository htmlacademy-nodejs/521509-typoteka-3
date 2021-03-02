'use strict';

/**
 * Проверка, что пользователь авторизован.
 *
 * !!
 * Это фронт-сервис, тут payload не проверяется. Если пользователь подделает payload, то вероятно в шапке отразится, что он супер админ.
 * Но это не критично, так как при первом же запросе к приватному API токен будет проверен.
 *
 * Плюс такого решения - меньше запросов к API.
 * !!
 */
const API = require(`../api`);

const {Base64} = require(`js-base64`);
const api = API.getDefaultAPI();


module.exports = async (req, res, next) => {
  try {
    // получаем токены из кук
    let {accessToken, refreshToken} = JSON.parse(req.cookies.tokens);

    // смотрим, что находится в payload в токенах
    let payloadAccess = JSON.parse(Base64.decode(accessToken.split(`.`)[1]));
    const payloadRefresh = JSON.parse(Base64.decode(refreshToken.split(`.`)[1]));

    // если оба токена вышли по сроку, то выбрасываем ошибку.
    if (payloadAccess.exp * 1000 < Date.now() && payloadRefresh.exp * 1000 < Date.now()) {
      throw new Error(`Tokens are expired.`);
    }

    // если access токен вышел по сроку, а refresh нет, то обновляем токены.
    if (payloadAccess.exp * 1000 < Date.now() && payloadRefresh.exp * 1000 > Date.now()) {

      // пробуем рефрешнуть
      ({accessToken, refreshToken} = await api.refreshAuthUser({refreshToken}));

      // запихиваем в куки, чтобы сохранились у пользователя
      res.cookie(`tokens`, JSON.stringify({accessToken, refreshToken}), {httpOnly: true});

      // парсим только токен access чтобы достать пользователя
      payloadAccess = JSON.parse(Base64.decode(accessToken.split(`.`)[1]));
    }

    // запоминаем пользователя
    res.locals.user = payloadAccess.data;
    res.locals.accessToken = accessToken;
    res.locals.isLogged = true;
  } catch (e) {
    // если что-то крешнулось, то считаем пользователя не авторизованным.
    req.log.debug(e);
    res.locals.isLogged = false;
    res.locals.user = {};
  }

  next();
};
