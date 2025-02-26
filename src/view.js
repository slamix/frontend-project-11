import onChange from "on-change";

const state = {
  links: [],
  feeds: [],
  posts: [],
  error: null,
};

/* const errorWatcher = (state, input) => {
  const forError = document.querySelector('#cont-for-error');
  if (!input.classList.contains('is-invalid')) {
    state.error = null;
    forError.textContent = '';
    return;
  }
  forError.textContent = state.error;
  return
} */

// TODO need to work with architecture of render function (improve error)

const render = (state) => {
  const headerOfFeeds = document.querySelector('#feeds');
  const ulForFeeds = document.querySelector('#for-feeds');
  const headerOfPosts = document.querySelector('#posts');
  const ulForPosts = document.querySelector('#for-posts');
  const forError = document.querySelector('#notification');
  const input = document.querySelector('input');
  input.focus();
  headerOfFeeds.textContent = 'Фиды';
  headerOfPosts.textContent = 'Посты';
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
  
  if (!input.classList.contains('is-invalid')) {
    state.error = null;
    forError.textContent = 'RSS успешно загружен';
    return;
  }
  forError.textContent = state.error;
  return;
  
  // errorWatcher(state, input);
} 

const watchedState = onChange(state, () => render(state));

export default watchedState;
