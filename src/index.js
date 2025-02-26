import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'
import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import watchedState from './view.js';
import info from './info.js';
import { addProxy, parseData } from './parser.js';

i18next.init({
  lng: 'ru',
  debug: false,
  resources: info,
});
// Пример: https://lorem-rss.hexlet.app/feed
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

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');

    sсhema.validate(url)
      .then(() => { // TODO we need to check our url, because we have links in
      // state (its more easier then check objects of feeds)
        if (watchedState.links.includes(url)) {
          throw new Error(i18next.t('errors.exists'));
        }
        if (!url.includes('rss')) {
          throw new Error(i18next.t('errors.noRss'));
        }

        const urlWithProxy = addProxy(url);
        axios.get(urlWithProxy)
          .then((response) => {
            const { feed, posts } = parseData(response.data.contents);
            
            watchedState.links.push(url);
            watchedState.feeds.push(feed);
            watchedState.posts.push(posts);

            input.classList.remove('is-invalid');
            input.value = '';
            watchedState.error = null;
          })
          .catch((error) => {
            input.classList.remove('is-invalid');
            watchedState.error = error.message;
          });
      })
      .catch((error) => {
        input.classList.add('is-invalid');
        watchedState.error = error.message;
      });
  });
}

app();
