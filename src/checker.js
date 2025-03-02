import axios from 'axios';
import watchedState from './view.js';

const rssChecker = (feed) => {
  axios.get(feed.link)
    .then((response) => {
      const parser = new DOMParser();
      const htmlData = parser.parseFromString(response.data.contents, 'text/xml');
      const items = [...htmlData.querySelectorAll('item')];
      const posts = items.map((item) => {
        const name = item.querySelector('title').textContent;
        const description = item.querySelector('description').textContent;
        const link = item.querySelector('link').textContent;
        const id = item.querySelector('guid').textContent;

        return {
          name,
          description,
          link,
          id,
          feedId: feed.id,
          isRead: false,
        }
      });
      const postsWithFeedId = watchedState.posts.filter((post) => post.feedId === feed.id);
      const postsId = postsWithFeedId.map((post) => post.id);
      const newPosts = posts.filter(({ id }) => !postsId.includes(id));

      if (newPosts.length !== 0) {
        watchedState.posts = [...newPosts, ...watchedState.posts];
      }
    });
}


const startCheck = (timeout = 5000) => {
  const check = () => {
    const promises = watchedState.feeds.map((feed) => rssChecker(feed));
    Promise.all(promises)
      .then(() => {
        setTimeout(check, timeout);
      })
      .catch(() => {
        setTimeout(check, timeout);
      });
  }
  check();
}

export default startCheck;