/* global describe, it */

'use strict'

var Cookie = require('..').Cookie
var Header = require('..').Header
var PostData = require('..').PostData
var Query = require('..').Query
var Request = require('..').Request
var validator = require('har-validator').request

require('should')

describe('Request', function () {
  it('should throw error when no url', function (done) {
    /* eslint-disable */
    (function () {
      new Request()
    }).should.throw('url required')
    /* eslint-enable */

    done()
  })

  it('should create an empty object with default values', function (done) {
    var request = new Request({
      url: 'http://localhost/'
    })

    request.should.be.an.Object
    request.should.have.property('bodySize').and.be.equal(0)
    request.should.have.property('comment').and.be.empty
    request.should.have.property('cookies').and.be.empty
    request.should.have.property('headers').and.be.empty
    request.should.have.property('headersSize').and.be.equal(33)
    request.should.have.property('httpVersion').and.be.empty
    request.should.have.property('method').and.be.empty
    request.should.have.property('queryString').and.be.empty
    request.should.have.property('url').and.be.equal('http://localhost/')
    request.should.have.property('postData').and.be.eql({
      mimeType: 'application/octet-stream',
      comment: undefined,
      params: [],
      text: ''
    })

    validator(request).should.be.true

    done()
  })

  describe('Headers', function () {
    it('should add a single header using an object', function (done) {
      var request = new Request({
        url: 'http://localhost/'
      })

      var header = {
        name: 'foo',
        value: 'bar',
        comment: 'foo'
      }

      request.addHeader(header)

      request.should.be.an.Object
      request.should.have.property('headers').and.eql([header])

      validator(request).should.be.true

      done()
    })

    it('should add a single header using an instance', function (done) {
      var request = new Request({
        url: 'http://localhost/'
      })

      var header = new Header('foo', 'bar', 'foo')

      request.addHeader(header)

      request.should.be.an.Object
      request.should.have.property('headers').and.eql([header])

      validator(request).should.be.true

      done()
    })

    it('should set headers on creation', function (done) {
      var header = {
        name: 'foo',
        value: 'bar',
        comment: 'foo'
      }

      var request = new Request({
        url: 'http://localhost/',
        headers: [header]
      })

      request.should.be.an.Object
      request.should.have.property('headers').and.eql([header])

      validator(request).should.be.true

      done()
    })

    it('should set headers manually', function (done) {
      var request = new Request({
        url: 'http://localhost/'
      })

      var header = {
        name: 'foo',
        value: 'bar',
        comment: 'foo'
      }

      request.headers = [header]

      request.should.be.an.Object
      request.should.have.property('headers').and.eql([header])

      validator(request).should.be.true

      done()
    })
  })

  describe('Cookies', function () {
    it('should add a single cookie using an object', function (done) {
      var request = new Request({
        url: 'http://localhost/'
      })

      var cookie = {
        name: 'foo',
        value: 'bar',
        path: '/',
        domain: 'www.ahmadnassri.com',
        expires: new Date().toISOString(),
        httpOnly: true,
        secure: true,
        comment: 'foo'
      }

      request.addCookie(cookie)

      request.should.be.an.Object
      request.should.have.property('cookies').and.eql([cookie])

      validator(request).should.be.true

      done()
    })

    it('should add a single cookie using an instance', function (done) {
      var request = new Request({
        url: 'http://localhost/'
      })

      var cookie = new Cookie({
        name: 'foo',
        value: 'bar',
        path: '/',
        domain: 'www.ahmadnassri.com',
        expires: new Date().toISOString(),
        httpOnly: true,
        secure: true,
        comment: 'foo'
      })

      request.addCookie(cookie)

      request.should.be.an.Object
      request.should.have.property('cookies').and.eql([cookie])

      validator(request).should.be.true

      done()
    })

    it('should set cookies on creation', function (done) {
      var cookie = {
        name: 'foo',
        value: 'bar',
        path: '/',
        domain: 'www.ahmadnassri.com',
        expires: new Date().toISOString(),
        httpOnly: true,
        secure: true,
        comment: 'foo'
      }

      var request = new Request({
        url: 'http://localhost/',
        cookies: [cookie]
      })

      request.should.be.an.Object
      request.should.have.property('cookies').and.eql([cookie])

      validator(request).should.be.true

      done()
    })

    it('should set cookies manually', function (done) {
      var request = new Request({
        url: 'http://localhost/'
      })

      var cookie = {
        name: 'foo',
        value: 'bar',
        path: '/',
        domain: 'www.ahmadnassri.com',
        expires: new Date().toISOString(),
        httpOnly: true,
        secure: true,
        comment: 'foo'
      }

      request.cookies = [cookie]

      request.should.be.an.Object
      request.should.have.property('cookies').and.eql([cookie])

      validator(request).should.be.true

      done()
    })
  })

  describe('queryString', function () {
    it('should add a single query using an object', function (done) {
      var request = new Request({
        url: 'http://localhost/'
      })

      var query = {
        name: 'foo',
        value: 'bar',
        comment: 'foo'
      }

      request.addQuery(query)

      request.should.be.an.Object
      request.should.have.property('queryString').and.eql([query])

      validator(request).should.be.true

      done()
    })

    it('should add a single query using an instance', function (done) {
      var request = new Request({
        url: 'http://localhost/'
      })

      var query = new Query('foo', 'bar', 'foo')

      request.addQuery(query)

      request.should.be.an.Object
      request.should.have.property('queryString').and.eql([query])

      validator(request).should.be.true

      done()
    })

    it('should set queryString on creation', function (done) {
      var query = {
        name: 'foo',
        value: 'bar',
        comment: 'foo'
      }

      var request = new Request({
        url: 'http://localhost/',
        queryString: [query]
      })

      request.should.be.an.Object
      request.should.have.property('queryString').and.eql([query])

      validator(request).should.be.true

      done()
    })

    it('should set queryString manually', function (done) {
      var request = new Request({
        url: 'http://localhost/'
      })

      var query = {
        name: 'foo',
        value: 'bar',
        comment: 'foo'
      }

      request.queryString = [query]

      request.should.be.an.Object
      request.should.have.property('queryString').and.eql([query])

      validator(request).should.be.true

      done()
    })
  })

  describe('headersSize', function () {
    it('should not allow setting value', function (done) {
      /* eslint-disable */
      (function () {
        var request = new Request({
          url: 'http://localhost/',
        })

        request.headersSize = 2
      }).should.throw('not allowed')
      /* eslint-enable */

      done()
    })

    it('should calculate headers size', function (done) {
      var request = new Request({
        method: 'GET',
        url: 'http://localhost/',
        headers: [new Header('foo', 'bar')]
      })

      request.headersSize.should.equal(44)

      done()
    })
  })

  describe('postData', function () {
    it('should allow setting postData from constructor', function (done) {
      var request = new Request({
        url: 'http://localhost/',
        postData: new PostData({
          mimeType: 'text/plain',
          comment: 'bar',
          params: [],
          text: 'foo'
        })
      })

      request.should.have.property('postData').and.be.eql({
        mimeType: 'text/plain',
        comment: 'bar',
        params: [],
        text: 'foo'
      })

      done()
    })

    it('should calculate postData size', function (done) {
      var request = new Request({
        url: 'http://localhost/',
        postData: new PostData({
          mimeType: 'text/plain',
          comment: 'bar',
          params: [],
          text: 'foo'
        })
      })

      request.should.have.property('bodySize').and.be.eql(3)

      done()
    })

    it('should not allow setting bodySize value', function (done) {
      /* eslint-disable */
      (function () {
        var request = new Request({
          url: 'http://localhost/'
        })

        request.bodySize = 2
      }).should.throw('not allowed')
      /* eslint-enable */

      done()
    })
  })
})
