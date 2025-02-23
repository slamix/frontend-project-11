import onChange from "on-change";

const state = {
  feeds: [],
  errors: [],
};

const render = (state) => {
  const container = document.querySelector('#rss-content');
  const errors = document.querySelector('.errors-cont');
  const input = document.querySelector('input');
  container.innerHTML = '';
  errors.innerHTML = '';
  input.focus();

  state.feeds.forEach((feed) => {
    const p = document.createElement('p');
    p.textContent = feed;
    container.appendChild(p);
  });

  state.errors.forEach((error) => {
    const li = document.createElement('li');
    li.textContent = error;
    errors.appendChild(li);
  });
}

const watchedState = onChange(state, () => render(state));

export default watchedState;