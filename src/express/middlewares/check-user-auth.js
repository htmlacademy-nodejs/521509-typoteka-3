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

const getPayloadFromToken = (token) => {
  const tokenParts = token.split(`.`);
  if (!tokenParts || !tokenParts[1]) {
    throw new Error(`Invalid JWT token.`);
  }

  return JSON.parse(Base64.decode(tokenParts[1]));
};


const checkOrRefreshTokens = async (tokens) => {
  if (!tokens) {
    throw new Error(`There aren't any tokens in cookies.`);
  }

  // смотрим, что находится в payload в токенах
  let payloadAccess = getPayloadFromToken(tokens.accessToken);
  const payloadRefresh = getPayloadFromToken(tokens.refreshToken);

  // если оба токена вышли по сроку, то выбрасываем ошибку.
  if (payloadAccess.exp * 1000 < Date.now() && payloadRefresh.exp * 1000 < Date.now()) {
    throw new Error(`Both tokens are expired.`);
  }

  // если access токен вышел по сроку, а refresh нет, то обновляем токены.
  let newTokens = null;
  if (payloadAccess.exp * 1000 < Date.now() && payloadRefresh.exp * 1000 > Date.now()) {

    // пробуем рефрешнуть
    newTokens = await api.refreshAuthUser({refreshToken: tokens.refreshToken});

    // парсим только токен access чтобы достать пользователя
    payloadAccess = getPayloadFromToken(newTokens.accessToken);
  }

  return {payloadAccess, newTokens};
};


module.exports = async (req, res, next) => {
  try {
    // получаем токены из кук
    let tokens = JSON.parse(req.cookies.tokens);

    const {payloadAccess, newTokens} = await checkOrRefreshTokens(tokens);

    // если токены обновились, то обновляем их в куках
    if (newTokens) {
      res.cookie(`tokens`, JSON.stringify(newTokens), {httpOnly: true});
    }

    // запоминаем пользователя
    res.locals.user = payloadAccess.data;
    res.locals.accessToken = newTokens ? tokens.accessToken : newTokens.accessToken;
  } catch (e) {
    // если что-то крешнулось, то считаем пользователя не авторизованным.
    req.log.debug(e);
    res.locals.user = {};
  }

  next();
};
