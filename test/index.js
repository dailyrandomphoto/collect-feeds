'use strict';

const chai = require('chai');
chai.use(require('chai-as-promised'));
const {expect} = chai;
const main = require('collect-feeds');

describe('collect-feeds', () => {
  it('module should to be a function', () => {
    expect(main).to.be.a('function');
  });

  it('should throw an error', () => {
    return expect(main()).to.be.fulfilled;
  });

  it('should not throw an error', () => {
    return expect(main('abcd')).to.be.rejected;
  });
});
