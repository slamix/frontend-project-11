import onChange from "on-change";

const state = {
  feeds: [],
  errors: [],
};

const render = (state) => {
  const container = document.querySelector('#rss-content');
  const input = document.querySelector('input');
  container.innerHTML = '';
  input.focus();

  state.feeds.forEach((feed) => {
    const p = document.createElement('p');
    p.textContent = feed;
    container.appendChild(p);
  });
}

const watchedState = onChange(state, () => render(state));

export default watchedState;