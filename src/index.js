import  'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'
import * as yup from 'yup';
import i18next from 'i18next';

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
        rssInput.classList.add('is-invalid');
        throw new Error('RSS поток уже добавлен');
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
