import _ from 'lodash';
import i18next from 'i18next';

const addProxy = (url) => {
  const urlWithProxy = new URL('/get', 'https://allorigins.hexlet.app');
  urlWithProxy.searchParams.set('url', url);
  urlWithProxy.searchParams.set('disableCache', 'true');
  return urlWithProxy.toString();
}

const parseData = (data, urlWithProxy) => {
  const parser = new DOMParser();
  const htmlData = parser.parseFromString(data, 'text/xml');

  if (htmlData.querySelector('parsererror')) {
    throw new Error(i18next.t('errors.noRss'));
  }

  const title = htmlData.querySelector('title');
  const description = htmlData.querySelector('description');
  const items = [...htmlData.querySelectorAll('item')];
  const feed = {
    link: urlWithProxy,
    title: title.textContent,
    description: description.textContent,
    id: _.uniqueId(),
  };

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
    };
  });

  return { feed, posts };
}

export { addProxy, parseData };