# lipo-express

[![build status](https://img.shields.io/travis/lipojs/lipo-express.svg)](https://travis-ci.org/lipojs/lipo-express)
[![code coverage](https://img.shields.io/codecov/c/github/lipojs/lipo-express.svg)](https://codecov.io/gh/lipojs/lipo-express)
[![code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![made with lass](https://img.shields.io/badge/made_with-lass-95CC28.svg)](https://lass.js.org)
[![license](https://img.shields.io/github/license/lipojs/lipo-express.svg)](LICENSE)

> Lipo middleware for Express and Connect


## Table of Contents

* [Install](#install)
* [Usage](#usage)
* [Contributors](#contributors)
* [License](#license)


## Install

[npm][]:

```sh
npm install lipo-express
```

[yarn][]:

```sh
yarn add lipo-express
```


## Usage

```js
const multer = require('multer');
const bytes = require('bytes');
const express = require('express');
const lipoExpress = require('lipo-express');

const app = express();

const upload = multer({
  limits: {
    fieldNameSize: bytes('100b'),
    fieldSize: bytes('1mb'),
    fileSize: bytes('5mb'),
    fields: 10,
    files: 1
  }
});
app.use(upload.single('input'));

// use lipo's express middleware
app.use(lipoExpress);

// start server
app.listen(3000);
```


## Contributors

| Name           | Website                    |
| -------------- | -------------------------- |
| **Nick Baugh** | <http://niftylettuce.com/> |


## License

[MIT](LICENSE) © [Nick Baugh](http://niftylettuce.com/)


## 

[npm]: https://www.npmjs.com/

[yarn]: https://yarnpkg.com/
