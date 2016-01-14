/* global describe, it */

'use strict'

var Content = require('..').Content
var Cookie = require('..').Cookie
var Header = require('..').Header
var Response = require('..').Response
var validator = require('har-validator').response

require('should')

describe('Response', function () {
  it('should throw error when no url', function (done) {
    /* eslint-disable */
    (function () {
      new Response()
    }).should.throw('missing required fields')
    /* eslint-enable */

    done()
  })

  it('should create an empty object with default values', function (done) {
    var response = new Response({
      status: 200,
      statusText: 'OK'
    })

    response.should.be.an.Object
    response.should.have.property('status').and.equal(200)
    response.should.have.property('statusText').and.equal('OK')
    response.should.have.property('httpVersion').and.equal('HTTP/1.1')
    response.should.have.property('cookies').and.be.empty
    response.should.have.property('headers').and.be.empty
    response.should.have.property('redirectURL').and.be.empty
    response.should.have.property('headersSize').and.be.equal(4)
    response.should.have.property('bodySize').and.be.equal(0)
    response.should.have.property('comment').and.be.empty
    response.should.have.property('content').and.be.eql(new Content())

    validator(response).should.be.true

    done()
  })

  describe('Headers', function () {
    it('should add a single header using an object', function (done) {
      var response = new Response({
        status: 200,
        statusText: 'OK'
      })

      var header = {
        name: 'foo',
        value: 'bar',
        comment: 'foo'
      }

      response.addHeader(header)

      response.should.be.an.Object
      response.should.have.property('headers').and.eql([header])

      validator(response).should.be.true

      done()
    })

    it('should add a single header using an instance', function (done) {
      var response = new Response({
        status: 200,
        statusText: 'OK'
      })

      var header = new Header('foo', 'bar', 'foo')

      response.addHeader(header)

      response.should.be.an.Object
      response.should.have.property('headers').and.eql([header])

      validator(response).should.be.true

      done()
    })

    it('should set headers on creation', function (done) {
      var header = {
        name: 'foo',
        value: 'bar',
        comment: 'foo'
      }

      var response = new Response({
        status: 200,
        statusText: 'OK',
        headers: [header]
      })

      response.should.be.an.Object
      response.should.have.property('headers').and.eql([header])

      validator(response).should.be.true

      done()
    })

    it('should set headers manually', function (done) {
      var response = new Response({
        status: 200,
        statusText: 'OK'
      })

      var header = {
        name: 'foo',
        value: 'bar',
        comment: 'foo'
      }

      response.headers = [header]

      response.should.be.an.Object
      response.should.have.property('headers').and.eql([header])

      validator(response).should.be.true

      done()
    })
  })

  describe('Cookies', function () {
    it('should add a single cookie using an object', function (done) {
      var response = new Response({
        status: 200,
        statusText: 'OK'
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

      response.addCookie(cookie)

      response.should.be.an.Object
      response.should.have.property('cookies').and.eql([cookie])

      validator(response).should.be.true

      done()
    })

    it('should add a single cookie using an instance', function (done) {
      var response = new Response({
        status: 200,
        statusText: 'OK'
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

      response.addCookie(cookie)

      response.should.be.an.Object
      response.should.have.property('cookies').and.eql([cookie])

      validator(response).should.be.true

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

      var response = new Response({
        status: 200,
        statusText: 'OK',
        cookies: [cookie]
      })

      response.should.be.an.Object
      response.should.have.property('cookies').and.eql([cookie])

      validator(response).should.be.true

      done()
    })

    it('should set cookies manually', function (done) {
      var response = new Response({
        status: 200,
        statusText: 'OK'
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

      response.cookies = [cookie]

      response.should.be.an.Object
      response.should.have.property('cookies').and.eql([cookie])

      validator(response).should.be.true

      done()
    })
  })

  describe('headersSize', function () {
    it('should not allow setting value', function (done) {
      /* eslint-disable */
      (function () {
        var response = new Response({
          status: 200,
          statusText: 'OK'
        })

        response.headersSize = 2
      }).should.throw('not allowed')
      /* eslint-enable */

      done()
    })

    it('should calculate headers size', function (done) {
      var response = new Response({
        status: 200,
        statusText: 'OK',
        headers: [new Header('foo', 'bar')]
      })

      response.headersSize.should.equal(12)

      done()
    })
  })

  describe('content', function () {
    it('should allow setting content from constructor', function (done) {
      var response = new Response({
        status: 200,
        statusText: 'OK',
        content: new Content()
      })

      response.should.have.property('content').and.be.eql(new Content())

      done()
    })

    it('should calculate content size', function (done) {
      var response = new Response({
        status: 200,
        statusText: 'OK',
        content: new Content({
          text: 'foo'
        })
      })

      response.should.have.property('bodySize').and.be.eql(3)

      done()
    })

    it('should not allow setting bodySize value', function (done) {
      /* eslint-disable */
      (function () {
        var response = new Response({
          status: 200,
          statusText: 'OK'
        })

        response.bodySize = 2
      }).should.throw('not allowed')
      /* eslint-enable */

      done()
    })
  })
})
