import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'
import * as yup from 'yup';
import watchedState from './view.js';
import info from './info.js';

const sсhema = yup.string().url('Ссылка должна быть валидным URL').required('Не должно быть пустым');

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
          throw new Error(info.translation.errors.exists);
        }

        watchedState.feeds.push(url);
        input.classList.remove('is-invalid');
        input.value = '';
      })
      .catch((error) => {
        input.classList.add('is-invalid');
        watchedState.errors.push(error.message);
      });
  });
}

app();
