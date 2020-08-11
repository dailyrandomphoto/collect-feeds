'use strict';

const chai = require('chai');
chai.use(require('chai-as-promised'));
const { expect } = chai;
const { findFeed } = require('../lib/find-feed.js');

describe('find-feed', function () {
  this.timeout(40000);
  describe('findFeed', () => {
    it('should throw an error', () => {
      return expect(findFeed()).to.be.rejected;
    });

    // it('should resolve a feed url', () => {
    //   return expect(findFeed('https://www.dailyrandomphoto.com'))
    //     .to.eventually.eql('https://www.dailyrandomphoto.com/atom.xml');
    // });
    //
    // it('should resolve a feed url from a tag', () => {
    //   return expect(findFeed('https://www.alloc-init.com/'))
    //     .to.eventually.eql('https://alloc-init.com/feed');
    // });
    //
    // it('should resolve a feed url from a tag', () => {
    //   return expect(findFeed('http://www.alloc-init.com/'))
    //     .to.eventually.eql('https://alloc-init.com/feed');
    // });
    //
    // it('should not return sitemap.xml', () => {
    //   return expect(findFeed('https://ashfurrow.com/'))
    //     .to.eventually.not.have.string('sitemap.xml');
    // });
    //
    // it('should not return opensearch.xml', () => {
    //   return expect(findFeed('http://www.adrop.me/'))
    //     .to.eventually.be.null;
    //     // .to.eventually.not.have.string('opensearch.xml');
    // });
    //
    // it('should not return search.xml', () => {
    //   return expect(findFeed('https://www.codementor.io/android/tutorial'))
    //     .to.eventually.not.have.string('search.xml');
    // });
    //
    // it('should not return search.xml', () => {
    //   return expect(findFeed('http://www.qingyu.me/'))
    //     .to.eventually.not.have.string('search.xml');
    // });
    //
    // it('should not return wlwmanifest.xml', () => {
    //   return expect(findFeed('https://acodez.in/blog/'))
    //     .to.eventually.not.have.string('wlwmanifest.xml');
    // });
  });

  describe('findFeeds', () => {});
});
