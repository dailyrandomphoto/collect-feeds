'use strict';

module.exports = {
  isArray: Array.isArray,

  unique: arr => [...new Set(arr)],

  filterEmpties: arr => arr.filter(v => Boolean(v)),

  urlAlias: url => {
    const regex = /https?:\/\/|www\.|\?.+|#.+|index\.html|\/$/g;
    url = url.replace(regex, '');
    // Replace one more time
    url = url.replace(regex, '');
    return url;
  }
};
