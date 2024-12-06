import  'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'
import * as yup from 'yup';

console.log('Hello, world!');

const shema = yup.string().url().required();

const feeds = new Set();

const form = document.getElementsByClassName('form');
const rssInput = document.querySelector('.form-control');
const rssContent = document.querySelector('#rss-content')

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const rssUrl = rssInput.value;
  rssInput.classList.remove('error');
  shema.validate(rssUrl)
    .then(() => {
      if (feeds.has(rssUrl)) {
        rssInput.classList.add('error');
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
      console.log('Validate error:', error);
      rssInput.classList.add('error');
      alert(error.message); 
    });    
});
