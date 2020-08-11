'use strict';

const util = require('util');
const rssFinder = require('rss-finder');
const feedFinder = util.promisify(require('feed-finder'));
const Queue = require('promise-queue');
const {isArray, filterEmpties, unique} = require('./utils.js');
const queue = new Queue(6, Infinity);
// Black List:
// - github user: https://github.com/user
const blackList = /^https?:\/\/github\.com\/[^/]+\/?$/;
const gotOptions = {
  headers: {
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:69.0) Gecko/20100101 Firefox/69.0'
  },
  timeout: 10000 // 10s
};

let knownFeedEndpoints = [
  'feed/',
  'feed',
  'feed.xml',
  'atom.xml',
  'rss.xml',
  'feed/rss/',
  'feed/rss2/',
  'feed/rdf/',
  'feed/atom/',
  '?feed=rss',
  '?feed=rss2',
  '?feed=rdf',
  '?feed=atom',
  'services/rss/'
];
knownFeedEndpoints = knownFeedEndpoints.concat(knownFeedEndpoints.map(v => {
  return '/' + v;
}));

function findFeed(url) {
  if (blackList.test(url)) {
    return Promise.resolve(null);
  }

  return Promise.all([queue.add(() => feedFinder(url, {knownFeedEndpoints, gotOptions})), queue.add(() => rssFinder({url, gotOptions}))])
    .then(result => {
      console.debug('\n----');
      console.debug(result[0]);
      console.debug(result[1]);
      const feedUrls1 = result[0];
      const feedUrls2 = result[1].feedUrls.map(v => v.url);

      if (feedUrls1[0] && feedUrls1[0] === feedUrls2[0]) {
        return feedUrls2[0];
      }

      for (let i = 0, len = feedUrls2.length; i < len; i++) {
        const feedUrl = feedUrls2[i];
        if (feedUrls1.includes(feedUrl)) {
          return feedUrl;
        }
      }

      const feedUrls = unique(filterEmpties(feedUrls2.concat(feedUrls1)));

      if (feedUrls.length > 0) {
        console.info(`Should check the url '${url}'. \n  Found different feed URLs: \n    - ${feedUrls.join('\n    - ')}`);
      }

      return feedUrls2[0] || feedUrls1[0] || null;
    });
}

function findFeeds(urls) {
  urls = isArray(urls) ? urls : [urls];
  return Promise.all(urls.map(url => {
    return findFeed(url)
      .then(feedUrl => ({
        url,
        feedUrl
      }))
      .catch(error => ({
        url,
        feedUrl: null,
        error
      }));
  }));
}

module.exports = {
  findFeed,
  findFeeds
};
