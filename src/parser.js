import _ from 'lodash';

const addProxy = (url) => {
  const urlWithProxy = new URL('/get', 'https://allorigins.hexlet.app');
  urlWithProxy.searchParams.set('url', url);
  urlWithProxy.searchParams.set('disableCache', 'true');
  return urlWithProxy.toString();
}

const parseData = (data) => {
  const parser = new DOMParser();
  const htmlData = parser.parseFromString(data, 'text/xml');
  const title = htmlData.querySelector('title');
  const description = htmlData.querySelector('description');
  const items = [...htmlData.querySelectorAll('item')];
  const feed = {
    title: title.textContent,
    description: description.textContent,
    id: _.uniqueId(),
  };
  const posts = items.map((item) => {
    const name = item.querySelector('title').textContent;
    const description = item.querySelector('description').textContent;
    const link = item.querySelector('link').textContent;
    const id = _.uniqueId();
    const feedId = feed.id;
    return {
      name,
      description,
      link,
      id,
      feedId,
    };
  });

  return { feed, posts };
}

export { addProxy, parseData };