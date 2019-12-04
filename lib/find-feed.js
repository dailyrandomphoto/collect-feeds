'use strict';

const util = require('util');
const rssFinder = require('rss-finder');
const feedFinder = util.promisify(require('feed-finder'));
const {isArray, filterEmpties, unique} = require('collect-feeds/lib/utils.js');
const Queue = require('promise-queue');
const queue = new Queue(5, Infinity);
const gotOptions = {
  headers: {
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:69.0) Gecko/20100101 Firefox/69.0'
  },
  timeout: 10000 // 10s
};

function findFeed(url) {
  return queue.add(() => Promise.all([feedFinder(url), rssFinder({url, gotOptions})]))
    .then(result => {
      const feedUrl1 = result[0][0] || null;
      const res2 = result[1];
      const feedUrl2 = res2.feedUrls && res2.feedUrls.length > 0 ? res2.feedUrls[0].url : null;

      if (feedUrl1 === feedUrl2) {
        return feedUrl2;
      }

      const feedUrls = unique(filterEmpties([].concat(res2.feedUrls.map(v => v.url), result[0])));

      console.warn(`Should check the url '${url}'. \n  Found different feed URLs: \n    - ${feedUrls.join('\n    - ')}`);
      return feedUrl2 || feedUrl1;
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
