import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'
import * as yup from 'yup';
import i18next from 'i18next';
import watchedState from './view.js';
import info from './info.js';

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
      .then(() => {
        if (watchedState.feeds.includes(url)) {
          throw new Error(i18next.t('errors.exists'));
        }

        watchedState.feeds.push(url);
        input.classList.remove('is-invalid');
        input.value = '';
        watchedState.error = null;
      })
      .catch((error) => {
        input.classList.add('is-invalid');
        watchedState.error = error.message;
      });
  });
}

app();
