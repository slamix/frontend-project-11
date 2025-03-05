import onChange from 'on-change';
import i18next from 'i18next';
import { Modal } from 'bootstrap';

const state = {
  feeds: [],
  posts: [],
  notification: null,
};

const renderFeeds = ({ feeds }) => {
  const headerOfFeeds = document.querySelector('#feeds');
  const ulForFeeds = document.querySelector('#for-feeds');
  headerOfFeeds.textContent = i18next.t('feeds');
  ulForFeeds.innerHTML = '';
  feeds.forEach((feed) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    li.id = feed.id;
    const h4 = document.createElement('h4');
    const p = document.createElement('p');
    h4.textContent = feed.title;
    p.textContent = feed.descOfFeed;
    li.append(h4, p);
    ulForFeeds.appendChild(li);
  });
};

const renderPosts = ({ posts }) => {
  const headerOfPosts = document.querySelector('#posts');
  const ulForPosts = document.querySelector('#for-posts');
  headerOfPosts.textContent = i18next.t('posts');
  ulForPosts.innerHTML = '';
  posts.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    li.id = post.id;

    const a = document.createElement('a');
    a.setAttribute('href', post.link);
    if (post.isRead === false) {
      a.classList.add('fw-bold');
    } else {
      a.classList.add('fw-normal');
    }
    a.textContent = post.name;

    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.classList.add('btn', 'btn-success');
    button.textContent = i18next.t('preview');
    button.addEventListener('click', (e) => {
      e.preventDefault();
      // eslint-disable-next-line no-param-reassign
      post.isRead = true;
      a.classList.remove('fw-bold');
      a.classList.add('fw-normal');
      const modalTitle = document.getElementById('postModalLabel');
      const modalDescription = document.getElementById('postModalDescription');
      const modalLink = document.getElementById('postModalLink');
      modalTitle.textContent = post.name;
      modalDescription.textContent = post.description;
      modalLink.setAttribute('href', post.link);
      const modal = new Modal(document.getElementById('postModal'));
      modal.show();
    });
    li.append(a, button);
    ulForPosts.appendChild(li);
  });
};

const renderError = ({ error }) => {
  const input = document.querySelector('input');
  const notification = document.querySelector('#notification');
  if (error !== null) {
    notification.classList.add('text-danger');
    notification.textContent = error;
    return;
  }
  input.classList.remove('is-invalid');
  input.focus();
  input.value = '';
  notification.classList.remove('text-danger');
  notification.classList.add('text-success');
  notification.textContent = i18next.t('loading.success');
};

const watchedState = onChange(state, (path) => {
  if (path === 'feeds') {
    renderFeeds(state);
    renderError(state);
  }
  if (path === 'posts') {
    renderPosts(state);
  }
  if (path === 'error') {
    renderError(state);
  }
});

export default watchedState;
