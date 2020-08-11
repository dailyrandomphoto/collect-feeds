# collect-feeds

[![NPM Version][npm-version-image]][npm-url]
[![LICENSE][license-image]][license-url]
[![Build Status][travis-image]][travis-url]
[![code style: prettier][code-style-prettier-image]][code-style-prettier-url]

A CLI for collect feed URLs.

## Installation

```sh
npm install collect-feeds
```

## Usages

```js
$ npx collect-feeds [COUNT]
```

Read URLs from the file `url-queue.txt` from the current working directory, then find feed URLs for the first `10` URLs.

With `COUNT`, fetch a specified number of URLs.

The found feed URLs are **appended** to `found.yml`, the failed URLs are appended to `failed.yml`.
Once a URL was fecthed, it will be appended to `skip-list.txt`, so next time will fast forward these URLs.
You can modify `skip-list.txt` to skip some URLs or re-fetch some URLs.

## License

Copyright (c) 2020 [dailyrandomphoto][my-url]. Licensed under the [MIT license][license-url].

[my-url]: https://github.com/dailyrandomphoto
[npm-url]: https://www.npmjs.com/package/collect-feeds
[travis-url]: https://travis-ci.org/dailyrandomphoto/collect-feeds
[license-url]: LICENSE
[code-style-prettier-url]: https://github.com/prettier/prettier
[npm-downloads-image]: https://img.shields.io/npm/dm/collect-feeds
[npm-version-image]: https://img.shields.io/npm/v/collect-feeds
[license-image]: https://img.shields.io/npm/l/collect-feeds
[travis-image]: https://img.shields.io/travis/dailyrandomphoto/collect-feeds
[code-style-prettier-image]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
