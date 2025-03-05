import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import watchedState from './view.js';
import ru from '../locales/ru.js';
import parseData from './parser.js';

const rssChecker = (feed) => {
  axios.get(feed.link)
    .then((response) => {
      const parser = new DOMParser();
      const htmlData = parser.parseFromString(response.data.contents, 'text/xml');
      const items = [...htmlData.querySelectorAll('item')];
      const posts = items.map((item) => {
        const name = item.querySelector('title').textContent;
        const description = item.querySelector('description').textContent;
        const link = item.querySelector('link').textContent;
        const id = item.querySelector('guid').textContent;

        return {
          name,
          description,
          link,
          id,
          feedId: feed.id,
          isRead: false,
        };
      });
      const postsWithFeedId = watchedState.posts.filter((post) => post.feedId === feed.id);
      const postsId = postsWithFeedId.map((post) => post.id);
      const newPosts = posts.filter(({ id }) => !postsId.includes(id));

      if (newPosts.length !== 0) {
        watchedState.posts = [...newPosts, ...watchedState.posts];
      }
    });
};

const startCheck = (timeout = 5000) => {
  const check = () => {
    const promises = watchedState.feeds.map((feed) => rssChecker(feed));
    Promise.all(promises)
      .then(() => {
        setTimeout(check, timeout);
      })
      .catch(() => {
        setTimeout(check, timeout);
      });
  };
  check();
};

i18next.init({
  lng: 'ru',
  debug: false,
  resources: ru,
});

yup.setLocale({
  mixed: {
    notOneOf: () => i18next.t('errors.exists'),
    required: () => i18next.t('errors.required'),
  },
  string: {
    url: () => i18next.t('errors.notUrl'),
  },
});

const sсhema = yup.string().url().required();

const addProxy = (url) => {
  const urlWithProxy = new URL('/get', 'https://allorigins.hexlet.app');
  urlWithProxy.searchParams.set('url', url);
  urlWithProxy.searchParams.set('disableCache', 'true');
  return urlWithProxy.toString();
};

const app = () => {
  const form = document.querySelector('form');
  const input = document.querySelector('input');
  const button = document.querySelector('#main-btn');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');
    sсhema.validate(url)
      .then(() => {
        const urlWithProxy = addProxy(url);
        const feedsLinks = watchedState.feeds.map((feed) => feed.link);
        if (feedsLinks.includes(urlWithProxy)) {
          throw new Error(i18next.t('errors.exists'));
        }

        button.disabled = true;
        axios.get(urlWithProxy)
          .then((response) => {
            const { feed, posts } = parseData(response.data.contents, urlWithProxy);
            watchedState.feeds.push(feed);
            watchedState.posts = [...posts, ...watchedState.posts];
            watchedState.error = null;
          })
          .catch((error) => {
            input.classList.add('is-invalid');
            if (error.code === 'ERR_NETWORK') {
              watchedState.error = i18next.t('errors.network');
            } else {
              watchedState.error = error.message;
            }
          })
          .finally(() => {
            button.disabled = false;
          });
      })
      .catch((error) => {
        input.classList.add('is-invalid');
        watchedState.error = error.message;
      });
  });
};

export { app, startCheck };
