'use strict';

const webSocket = io('http://localhost:3000');

new Vue({
  el: `.vue-section`,
  template: `
      <div v-if="isShown" class="main-page__section-flex">
        <section class="main-page__hot hot">
          <h2 class="hot__name">Самое обсуждаемое <span class="hot__icon hot__icon--fire"></span></h2>
          <ul v-if="mostDiscussedArticles.length" class="hot__list">
            <li
              v-for="article in mostDiscussedArticles"
              v-key="article.id"
              class="hot__list-item"
            >
              <a
                class="hot__list-link"
                :href="getArticleURL(article.id)"
              >{{ getProcessedText(article.announce) }} <sup class="hot__link-sup">{{ article.commentsCount }}</sup>
              </a>
            </li>
          </ul>
          <p v-else class="hot__empty">Здесь пока ничего нет...</p>
        </section>
        <section class="main-page__last last">
          <h2 class="last__name">Последние комментарии <span class="last__icon last__icon--cloud"></span></h2>
          <ul v-if="lastComments.length" class="last__list">
            <li
              v-for="comment in lastComments"
              v-key="comment.id"
              class="last__list-item"
             >
              <img
                class="last__list-image"
                :src="getUserAvatarURL(comment.users.avatar)"
                width="20" height="20"
                alt="Аватар пользователя"
               >
              <b class="last__list-name">{{ comment.users.firstName }} {{ comment.users.lastName }}</b>
              <a
                class="last__list-link"
                :href="getArticleURL(comment['article_id'])"
              >{{ getProcessedText(comment.text) }}</a>
            </li>
          </ul>
          <p v-else class="last__empty">Здесь пока ничего нет...</p>
    </div>
  `,
  data: {
    mostDiscussedArticles: [],
    lastComments: [],
    isShown: false
  },
  methods: {
    updateCommentsHandler(newData) {
      if (!this.isShown) {
        document.querySelector(`.hide-on-update`).style.display = `none`;
        this.isShown = true;
      }
      this.lastComments = newData
    },
    updateMostDiscussedArticlesHandler(newData) {
      this.mostDiscussedArticles = newData
    },
    getUserAvatarURL(avatar) {
      return `/img/${avatar ? avatar : 'icons/smile.svg'}`
    },
    getArticleURL(articleId) {
      return `/articles/${articleId}`
    },
    getProcessedText(text) {
      return (text.length < 100) ? text : (text.slice(0,100) + '...')
    }
  },
  mounted(){
    webSocket.addEventListener(`commentsUpdated`, this.updateCommentsHandler);
    webSocket.addEventListener(`mostDiscussedArticlesUpdated`, this.updateMostDiscussedArticlesHandler);
  }
});
