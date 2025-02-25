import onChange from "on-change";

const state = {
  feeds: [],
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
  return;
} */

const render = (state) => {
  const container = document.querySelector('#rss-content');
  const forError = document.querySelector('#cont-for-error');
  const input = document.querySelector('input');
  container.innerHTML = '';
  input.focus();

  state.feeds.forEach((feed) => {
    const p = document.createElement('p');
    p.textContent = feed;
    container.appendChild(p);
  });

  if (!input.classList.contains('is-invalid')) {
    state.error = null;
    forError.textContent = '';
    return;
  }
  forError.textContent = state.error;
  return;
  
  // errorWatcher(state, input);
} 

const watchedState = onChange(state, () => render(state));

export default watchedState;