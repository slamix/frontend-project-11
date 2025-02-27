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
      .then(() => { 
        if (watchedState.links.includes(url)) {
          throw new Error(i18next.t('errors.exists'));
        }

        const urlWithProxy = addProxy(url);
        axios.get(urlWithProxy)
          .then((response) => {
            const { feed, posts } = parseData(response.data.contents);
            
            if (feed === null && posts === null) {
              throw new Error(i18next.t('errors.noRss'));
            }
            
            watchedState.links.push(url);
            watchedState.feeds.push(feed);
            watchedState.posts.push(posts);
            watchedState.error = null;
          })
          .catch((error) => {
            input.classList.add('is-invalid');
            console.log(error.code);
            if (error.code === 'ERR_NETWORK') {
              watchedState.error = i18next.t('errors.network');
            } else {
              watchedState.error = i18next.t('errors.unknown');
            }
          });
      })
      .catch((error) => {
        input.classList.add('is-invalid');
        watchedState.error = error.message;
      });
  });
}

app();
