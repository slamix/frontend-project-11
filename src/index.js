import  'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'
import * as yup from 'yup';
import i18next from 'i18next';
import info from './info.js';

yup.setLocale({
  string: {
    url: 'qpwkfpqf',
  }
});

const shema = yup.string().url().required();
const feeds = new Set();

const form = document.getElementById('form');
const rssInput = document.querySelector('.form-control');
const rssContent = document.querySelector('#rss-content')

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const rssUrl = rssInput.value;
  rssInput.classList.remove('is-invalid');
  shema.validate(rssUrl)
    .then(() => {
      if (feeds.has(rssUrl)) {
        throw new Error(info.errors.exists);
      }
      return Promise.resolve();
    })
    .then(() => {
      feeds.add(rssUrl);
      rssContent.innerHTML += `<p>RSS поток: ${rssUrl} </p>`;
      rssInput.value = '';
      rssInput.focus();
    })
    .catch((error) => {
      rssInput.classList.add('is-invalid');
      console.log('Validate error:', error);
      alert(error.message);
    });    
});
