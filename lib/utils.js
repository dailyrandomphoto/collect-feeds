'use strict';

module.exports = {
  isArray: Array.isArray,

  unique: (array) => [...new Set(array)],

  filterEmpties: (array) => array.filter((v) => Boolean(v)),

  urlAlias: (url) => {
    const regex = /https?:\/\/|www\.|\?.+|#.+|index\.html|\/$/g;
    url = url.replace(regex, '');
    // Replace one more time
    url = url.replace(regex, '');
    return url;
  }
};
