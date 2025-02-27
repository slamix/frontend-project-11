import onChange from "on-change";

const state = {
  links: [],
  feeds: [],
  posts: [],
  error: null,
};

// TODO need to work with architecture of render function (improve error)

const renderContent = (state) => {
  const headerOfFeeds = document.querySelector('#feeds');
  const ulForFeeds = document.querySelector('#for-feeds');
  const headerOfPosts = document.querySelector('#posts');
  const ulForPosts = document.querySelector('#for-posts');
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
  notification.textContent = 'RSS успешно загружен';
  return;
}

const watchedState = onChange(state, (path) => {
  console.log(path);
  render(state);
})

export default watchedState;
