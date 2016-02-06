# HAR [![version][npm-version]][npm-url] [![License][npm-license]][license-url]

HTTP Archive (HAR) Dynamic Object, auto generates values & utility methods for easy manipulation and lookup

[![Build Status][travis-image]][travis-url]
[![Downloads][npm-downloads]][npm-url]
[![Code Climate][codeclimate-quality]][codeclimate-url]
[![Coverage Status][codeclimate-coverage]][codeclimate-url]
[![Dependencies][david-image]][david-url]

## Features

- Import/export HAR objects
- Accepts `Date` Objects for all date time fields, automatically converts to ISO format
- Generates default values for common properties (Dates, IDs, etc...)
- Automatically calculates `headersSize`

## TODO

- [ ] Automatically parse request `url` to create `queryString` objects and set `Host` header
- [ ] Automatically update request url when `queryString` is modified

## Install

```sh
npm install --save har
```

## API

```js
var HAR = require('har')
```

### HAR.Log(data)

- **data**: `Object` *(a [log](http://www.softwareishard.com/blog/har-12-spec/#log) object)*

```js
new HAR.Log({
  version: 1.2,
  creator: creator,
  browser: browser,
  comment: 'foo',
})
```

#### HAR.Log.addPage(page)

- **page**: `Object` *(a [page](http://www.softwareishard.com/blog/har-12-spec/#pages) object)*

```js
var page = new HAR.Page({
  id: 'foo',
  title: 'hello world',
  startedDateTime: new Date()
})

new HAR.Log().addPage(page)
```

#### HAR.Log.addEntry(entry)

- **entry**: `Object` *(an [entry](http://www.softwareishard.com/blog/har-12-spec/#entries) object)*

```js
var entry = new HAR.Entry({
  startedDateTime: new Date(),
  request: request,
  response: response
})

new HAR.Log().addEntry(entry)
```

----

### HAR.CacheEntry(data)

- **data**: `Object` *(a ["beforeRequest" or "afterRequest"](http://www.softwareishard.com/blog/har-12-spec/#cache) objects)*

```js
new HAR.CacheEntry({
  eTag: 'foo',
  hitCount: 10,
  expires: new Date(),
  lastAccess: new Date(),
  comment: 'foo'
})
```

### HAR.Content(data)

- **data**: `Object` *(a [content](http://www.softwareishard.com/blog/har-12-spec/#content) object)*

```js
new Content({
  compression: 20,
  mimeType: 'multipart/form-content',
  text: 'foo=bar',
  encoding: 'base64',
  comment: 'hello world'
})
```

### HAR.Cookie(data)

- **data**: `Object` *(a [cookie](http://www.softwareishard.com/blog/har-12-spec/#cookies) object)*

```js
new HAR.Cookie({
  name: 'foo',
  value: 'bar',
  path: '/',
  domain: 'www.ahmadnassri.com',
  expires: date,
  httpOnly: true,
  secure: true,
  comment: 'foo'
})
```

### HAR.Creator(data)

- **data**: `Object` *(a [creator](http://www.softwareishard.com/blog/har-12-spec/#creator) object)*

```js
new HAR.Creator({
  name: 'Node HAR',
  version: '1.0'
})
```

### HAR.Browser(data)

- **data**: `Object` *(a [browser](http://www.softwareishard.com/blog/har-12-spec/#browser) object)*

```js
new HAR.Browser({
  name: 'My Browser',
  version: '5.0'
})
```

### HAR.Entry(data)

- **data**: `Object` *(an [entry](http://www.softwareishard.com/blog/har-12-spec/#entries) object)*

```js
new HAR.Entry({
  startedDateTime: new Date(),
  request: request,
  response: response
})
```

### HAR.Header(data)

- **data**: `Object` *(a [header](http://www.softwareishard.com/blog/har-12-spec/#headers) object)*

```js
new HAR.Header({
  name: 'foo',
  value 'bar',
  comment: 'foo'
})
```

### HAR.Page(data)

- **data**: `Object` *(a [page](http://www.softwareishard.com/blog/har-12-spec/#pages) object)*

```js
new HAR.Page({
  id: 'foo',
  title: 'hello world',
  startedDateTime: new Date(),
  pageTimings: {
    onLoad: 0,
    onContentLoad: 0
  },
  comment: 'foo'
})
```

### HAR.Param(data)

- **data**: `Object` *(a [postData Param](http://www.softwareishard.com/blog/har-12-spec/#postData) object)*

```js
new HAR.Param({
  comment: 'hello',
  contentType: 'text/plain',
  fileName: 'foo.bar',
  name: 'foo',
  value: 'bar'
})
```

### HAR.PostData(data)

- **data**: `Object` *(a [postData](http://www.softwareishard.com/blog/har-12-spec/#postData) object)*

```js
new HAR.PostData({
  comment: 'hello world',
  mimeType: 'multipart/form-data',
  text: 'foo=bar'
})
```

#### HAR.PostData.addParam(param)

- **param**: `Object` *(a [postData](http://www.softwareishard.com/blog/har-12-spec/#postData) object)*

```js
new HAR.PostData().addParam(param)
```

### HAR.Query(data)

- **data**: `Object` *(a [query](http://www.softwareishard.com/blog/har-12-spec/#queryString) object)*

```js
new HAR.Header({
  name: 'foo',
  value 'bar',
  comment: 'foo'
})
```

### HAR.Request(data)

- **data**: `Object` *(a [request](http://www.softwareishard.com/blog/har-12-spec/#request) object)*

*Automatically Calculated Values:*
- `headersSize`
- `bodySize`

```js
var request = new HAR.Request({
  url: 'https://ahmadnassri.github.io/har-resources/',
  headers: [
    new Header('foo', 'bar')
  ],
  postData: new PostData({
    mimeType: 'text/plain',
    text: 'foo'
  })
})

// request.headersSize === 44
// request.bodySize === 3
```

#### HAR.Request.addCookie(cookie)

- **cookie**: `Object` *(a [cookie](http://www.softwareishard.com/blog/har-12-spec/#cookies) object)*

```js
new HAR.Request().addCookie(cookie)
```

#### HAR.Request.addHeader(header)

- **header**: `Object` *(a [header](http://www.softwareishard.com/blog/har-12-spec/#headers) object)*

```js
new HAR.Request().addHeader(header)
```

#### HAR.Request.addQuery(query)

- **query**: `Object` *(a [queryString](http://www.softwareishard.com/blog/har-12-spec/#queryString) object)*

```js
new HAR.Request().addQuery(query)
```

### HAR.Response(data)

- **data**: `Object` *(a [response](http://www.softwareishard.com/blog/har-12-spec/#response) object)*

*Automatically Calculated Values:*
- `headersSize`
- `bodySize`
- `content.size`

```js
var response = new HAR.Response({
  status: 200,
  statusText: 'OK'
  headers: [
    new Header('foo', 'bar')
  ],
  content: new PostData({
    text: 'foo'
  })
})

// response.headersSize === 12
// response.bodySize === 3
// response.content.size === 3
```

#### HAR.Response.addCookie(cookie)

- **cookie**: `Object` *(a [cookie](http://www.softwareishard.com/blog/har-12-spec/#cookies) object)*

```js
new HAR.Response().addCookie(cookie)
```

#### HAR.Response.addHeader(header)

- **header**: `Object` *(a [header](http://www.softwareishard.com/blog/har-12-spec/#headers) object)*

```js
new HAR.Response().addHeader(header)
```

## Support

Donations are welcome to help support the continuous development of this project.

[![Gratipay][gratipay-image]][gratipay-url]
[![PayPal][paypal-image]][paypal-url]
[![Flattr][flattr-image]][flattr-url]
[![Bitcoin][bitcoin-image]][bitcoin-url]

## License

[MIT](LICENSE) &copy; [Ahmad Nassri](https://www.ahmadnassri.com)

[license-url]: https://github.com/ahmadnassri/har/blob/master/LICENSE

[travis-url]: https://travis-ci.org/ahmadnassri/har
[travis-image]: https://img.shields.io/travis/ahmadnassri/har.svg?style=flat-square

[npm-url]: https://www.npmjs.com/package/har
[npm-license]: https://img.shields.io/npm/l/har.svg?style=flat-square
[npm-version]: https://img.shields.io/npm/v/har.svg?style=flat-square
[npm-downloads]: https://img.shields.io/npm/dm/har.svg?style=flat-square

[codeclimate-url]: https://codeclimate.com/github/ahmadnassri/har
[codeclimate-quality]: https://img.shields.io/codeclimate/github/ahmadnassri/har.svg?style=flat-square
[codeclimate-coverage]: https://img.shields.io/codeclimate/coverage/github/ahmadnassri/har.svg?style=flat-square

[david-url]: https://david-dm.org/ahmadnassri/har
[david-image]: https://img.shields.io/david/ahmadnassri/har.svg?style=flat-square

[gratipay-url]: https://www.gratipay.com/ahmadnassri/
[gratipay-image]: https://img.shields.io/gratipay/ahmadnassri.svg?style=flat-square

[paypal-url]: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=UJ2B2BTK9VLRS&on0=project&os0=har
[paypal-image]: http://img.shields.io/badge/paypal-donate-green.svg?style=flat-square

[flattr-url]: https://flattr.com/submit/auto?user_id=ahmadnassri&url=https://github.com/ahmadnassri/har&title=har&language=&tags=github&category=software
[flattr-image]: http://img.shields.io/badge/flattr-donate-green.svg?style=flat-square

[bitcoin-image]: http://img.shields.io/badge/bitcoin-1Nb46sZRVG3or7pNaDjthcGJpWhvoPpCxy-green.svg?style=flat-square
[bitcoin-url]: https://www.coinbase.com/checkouts/ae383ae6bb931a2fa5ad11cec115191e?name=har
