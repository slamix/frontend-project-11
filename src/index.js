import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'
import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import watchedState from './view.js';
import info from './info.js';
import { addProxy, parseData } from './parser.js';
import startCheck from './checker.js';

i18next.init({
  lng: 'ru',
  debug: false,
  resources: info,
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
          .finally(() => button.disabled = false);
      })
      .catch((error) => {
        input.classList.add('is-invalid');
        watchedState.error = error.message;
      });
  });
}

app();
startCheck();
