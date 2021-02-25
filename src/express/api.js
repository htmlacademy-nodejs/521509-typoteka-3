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

  async _request(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }

  getArticles({page = 1, isWithComments = false, categoryId = null} = {}) {
    return this._request(`/articles`, {params: {page, isWithComments, categoryId}});
  }

  getArticle(id) {
    return this._request(`/articles/${id}`);
  }

  search(query) {
    return this._request(`/search`, {params: {query}});
  }

  getCategories({isWithCount = false} = {}) {
    return this._request(`/categories`, {params: {isWithCount}});
  }

  createArticle(data) {
    return this._request(`/articles`, {
      method: Methods.POST,
      data
    });
  }

  static getDefaultAPI() {
    const url = `${process.env.API_DOMAIN_URL}:${process.env.API_SERVICE_PORT}${process.env.API_PREFIX}`;
    return new this(url, +process.env.TIMEOUT);
  }
}

module.exports = API;
