import onChange from "on-change";
import i18next from "i18next";

const state = {
  links: [],
  feeds: [],
  posts: [],
  error: null,
};

const renderContent = (state) => {
  const headerOfFeeds = document.querySelector('#feeds');
  const ulForFeeds = document.querySelector('#for-feeds');
  const headerOfPosts = document.querySelector('#posts');
  const ulForPosts = document.querySelector('#for-posts');
  headerOfFeeds.textContent = i18next.t('feeds');
  headerOfPosts.textContent = i18next.t('posts');
  ulForFeeds.innerHTML = '';
  ulForPosts.innerHTML = '';

  state.feeds.forEach((feed) => {
    const li = document.createElement('li');
    li.id = feed.id;
    const h4 = document.createElement('h4');
    const p = document.createElement('p');
    h4.textContent = feed.title;
    p.textContent = feed.description;
    li.append(h4, p);
    ulForFeeds.appendChild(li);
  });

  state.posts.forEach((coll) => coll.forEach((post) => {
    const li = document.createElement('li');
    li.id = post.id;
    const a = document.createElement('a');
    a.setAttribute('href', post.link);
    a.textContent = post.name;
    li.appendChild(a);
    ulForPosts.appendChild(li);
  }));
}

const render = (state) => {
  const input = document.querySelector('input');
  const notification = document.querySelector('#notification');
  if (state.error !== null) {
    notification.textContent = state.error;
    return;
  }
  renderContent(state);
  input.classList.remove('is-invalid');
  input.focus();
  input.value = '';
  notification.textContent = i18next.t('loading.success');
  return;
}

const watchedState = onChange(state, () => render(state));

export default watchedState;
