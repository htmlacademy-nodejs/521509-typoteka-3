'use strict';
const axios = require(`axios`);

const {Methods} = require(`../consts`);

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout
    });
  }

  /*
    Методы для работы с публикациями
   */
  getArticles({page = 1, isWithComments = false, categoryId = null} = {}) {
    return this._request(`/articles`, {params: {page, isWithComments, categoryId}});
  }

  getMostDiscussedArticles() {
    return this._request(`/articles/most-discussed`);
  }

  getArticlesForAuthor({page = 1, isWithComments = false} = {}, token) {
    return this._request(`/articles/author`, {params: {page, isWithComments}}, token);
  }

  getArticle(id) {
    return this._request(`/articles/${id}`);
  }

  createArticle(data, token) {
    return this._request(`/articles`, {
      method: Methods.POST,
      data
    }, token);
  }

  updateArticle(id, data, token) {
    return this._request(`/articles/${id}`, {
      method: Methods.PUT,
      data
    }, token);
  }

  deleteArticle(id, token) {
    return this._request(`/articles/${id}`, {
      method: Methods.DELETE
    }, token);
  }

  /*
    Методы для работы с комментариями
   */
  getLastComments() {
    return this._request(`/articles/comments/last`);
  }

  getAllComments(token) {
    return this._request(`/articles/comments/`, {}, token);
  }

  addComment(articleId, data, token) {
    return this._request(`/articles/${articleId}/comments`, {
      method: Methods.POST,
      data
    }, token);
  }


  deleteComment(articleId, commentId, token) {
    return this._request(`/articles/${articleId}/comments/${commentId}`, {
      method: Methods.DELETE
    }, token);
  }

  /*
    Методы для работы поиска
   */
  search({searchText, page = 1}) {
    return this._request(`/search`, {params: {query: searchText, page}});
  }

  /*
    Методы для работы с категориями
   */
  getCategories({isWithCount = false} = {}) {
    return this._request(`/categories`, {params: {isWithCount}});
  }

  addCategory(data, token) {
    return this._request(`/categories`, {
      method: Methods.POST,
      data
    }, token);
  }

  updateCategory(id, data, token) {
    return this._request(`/categories/${id}`, {
      method: Methods.PUT,
      data
    }, token);
  }

  deleteCategory(id, token) {
    return this._request(`/categories/${id}`, {
      method: Methods.DELETE
    }, token);
  }

  /*
    Методы для работы с пользователем
   */
  addUser(data) {
    return this._request(`/users`, {
      method: Methods.POST,
      data
    });
  }

  /*
    Методы для работы с авторизации
   */
  authUser(data) {
    return this._request(`/auth`, {
      method: Methods.POST,
      data
    });
  }

  refreshAuthUser(data) {
    return this._request(`/auth/refresh`, {
      method: Methods.POST,
      data
    });
  }

  async _request(url, options, token) {
    const headers = token ? {authorization: `Bearer ${token}`} : {};
    const response = await this._http.request({url, ...options, headers});
    return response.data;
  }

  static getDefaultAPI() {
    const url = `${process.env.API_DOMAIN_URL}:${process.env.API_SERVICE_PORT}${process.env.API_PREFIX}`;
    return new this(url, +process.env.TIMEOUT);
  }
}


module.exports = API;
