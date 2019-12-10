#!/usr/bin/env node

'use strict';

const {resolve} = require('path');
const lockfile = require('proper-lockfile');
const fs = require('fs-extra');
const Queue = require('promise-queue');
const fileAppendQueue = new Queue(1, Infinity);
const {urlAlias} = require('collect-feeds/lib/utils.js');
const {findFeed} = require('./find-feed.js');
const FOUND_TMP_FILE_PATH = resolve(process.cwd(), 'found.yml');
const FAILED_TMP_FILE_PATH = resolve(process.cwd(), 'failed.yml');
const SKIP_LIST_FILE_PATH = resolve(process.cwd(), 'skip-list.txt');
const URL_QUEUE_FILE_PATH = resolve(process.cwd(), 'url-queue.txt');

if (!fs.existsSync(FOUND_TMP_FILE_PATH)) {
  fs.writeFileSync(FOUND_TMP_FILE_PATH, '');
}

if (!fs.existsSync(FAILED_TMP_FILE_PATH)) {
  fs.writeFileSync(FAILED_TMP_FILE_PATH, '');
}

if (!fs.existsSync(SKIP_LIST_FILE_PATH)) {
  fs.writeFileSync(SKIP_LIST_FILE_PATH, '');
}

if (!fs.existsSync(URL_QUEUE_FILE_PATH)) {
  fs.writeFileSync(URL_QUEUE_FILE_PATH, '');
}

function readUrls(filepath) {
  return fs.readFile(filepath)
    .then(content => {
      return content.toString().split('\n');
    });
}

function fetchFeeds(urls) {
  return Promise.all(urls.map(url => {
    if (!url) {
      return Promise.resolve();
    }

    return findFeed(url)
      .then(feedUrl => {
        if (feedUrl) {
          return appendFound({alias: urlAlias(url), url, feedUrl})
            .then(appendSkipList(url));
        }

        return appendFailed(url, 'Feed URL not found')
          .then(appendSkipList(url));
      })
      .catch(error => {
        return appendFailed(url, error)
          .then(appendSkipList(url));
      });
  }));
}

function appendFound(feed) {
  const filepath = FOUND_TMP_FILE_PATH;
  const content = `-
  alias: ${feed.alias}
  url: ${feed.url}
  feedUrl: ${feed.feedUrl}
`;

  // With queue, maybe lockfile is not required
  return fileAppendQueue.add(() => lockfile.lock(filepath, {retries: 5}))
    .then(() => {
      console.info(`append to found list. ${feed.url}`);
      return fs.appendFile(filepath, content);
    })
    .then(() => lockfile.unlock(filepath));
}

function appendFailed(url, error) {
  const filepath = FAILED_TMP_FILE_PATH;
  const content = `-
  date: ${new Date()}
  url: ${url}
  reason: ${String(error)}
`;

  return fileAppendQueue.add(() => lockfile.lock(filepath, {retries: 5}))
    .then(() => {
      console.info(`append to failed list. ${url}`);
      return fs.appendFile(filepath, content);
    })
    .then(() => lockfile.unlock(filepath));
}

function appendSkipList(url) {
  const filepath = SKIP_LIST_FILE_PATH;

  return fileAppendQueue.add(() => lockfile.lock(filepath, {retries: 5}))
    .then(() => {
      console.info(`append to skip list. ${url}`);
      return fs.appendFile(filepath, url + '\n');
    })
    .then(() => lockfile.unlock(filepath));
}

function main(count) {
  // Only fetch a specified number of URLs.
  count = parseInt(count || 10, 10);

  if (typeof count !== 'number' || isNaN(count)) {
    return Promise.reject(new TypeError('Invalid value of count.'));
  }

  // console.log('COUNT: ' + count);

  return Promise.all([readUrls(URL_QUEUE_FILE_PATH), readUrls(SKIP_LIST_FILE_PATH)])
    .then(result => {
      const [urls, skips] = result;
      return urls.filter(url => {
        return !skips.includes(url);
      }).slice(0, count);
    })
    .then(fetchFeeds);
}

function exit(err) {
  if (err) {
    console.error('\n' + err);
    console.error('\nUsage: collect-feeds [COUNT]');

    process.exit(1);
  }

  process.exit();
}

if (require.main === module) { // Called directly
  const count = process.argv[2];

  main(count)
    .catch(error => {
      exit(error);
    });
} else { // Required as a module
  module.exports = main;
}
