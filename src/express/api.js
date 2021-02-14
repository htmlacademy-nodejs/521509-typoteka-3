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

  getArticles() {
    return this._request(`/articles`);
  }

  getArticle(id) {
    return this._request(`/articles/${id}`);
  }

  search(query) {
    return this._request(`/search`, {params: {query}});
  }

  getCategories() {
    return this._request(`/categories`);
  }

  createArticle(data) {
    return this._request(`/articles`, {
      method: Methods.POST,
      data
    });
  }

  static getDefaultAPI() {
    return new this(process.env.API_URL, +process.env.TIMEOUT);
  }
}

module.exports = API;
