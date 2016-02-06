/* global describe, it */

'use strict'

var HAR = require('..')
var validator = require('har-validator').entry

require('should')

describe('Entry', function () {
  describe('Required Fields', function () {
    it('should throw an error when missing options', function (done) {
      /* eslint-disable */
      (function () {
        new HAR.Entry()
      }).should.throw('missing required fields')
      /* eslint-enable */

      done()
    })

    it('should throw an error when missing startedDateTime', function (done) {
      /* eslint-disable */
      (function () {
        new HAR.Entry({
          request: 'foo',
          response: 'bar'
        })
      }).should.throw('missing required fields')
      /* eslint-enable */

      done()
    })

    it('should throw an error when missing request', function (done) {
      /* eslint-disable */
      (function () {
        new HAR.Entry({
          startedDateTime: 'foo',
          response: 'bar'
        })
      }).should.throw('missing required fields')
      /* eslint-enable */

      done()
    })

    it('should throw an error when missing response', function (done) {
      /* eslint-disable */
      (function () {
        new HAR.Entry({
          startedDateTime: 'foo',
          request: 'bar'
        })
      }).should.throw('missing required fields')
      /* eslint-enable */

      done()
    })
  })

  it('should create an object with default values', function (done) {
    var date = new Date()
    var request = new HAR.Request({
      url: 'http://localhost/'
    })

    var response = new HAR.Response({
      status: 200,
      statusText: 'OK'
    })

    var entry = new HAR.Entry({
      startedDateTime: date,
      request: request,
      response: response
    })

    entry.should.be.an.Object
    entry.should.have.property('startedDateTime').and.equal(date.toISOString())
    entry.should.have.property('time').and.equal(-1)
    entry.should.have.property('request').and.eql(request)
    entry.should.have.property('response').and.eql(response)

    entry.should.have.property('cache').and.eql({
      beforeRequest: null,
      afterRequest: null,
      comment: undefined
    })

    entry.should.have.property('timings').and.eql({
      blocked: -1,
      comment: undefined,
      connect: -1,
      dns: -1,
      receive: -1,
      send: -1,
      wait: -1
    })

    entry.should.have.property('connection').and.be.empty
    entry.should.have.property('pageref').and.be.empty
    entry.should.have.property('comment').and.be.empty

    validator(entry).should.be.true

    done()
  })

  it('should set time property', function (done) {
    var request = new HAR.Request({
      url: 'http://localhost/'
    })

    var response = new HAR.Response({
      status: 200,
      statusText: 'OK'
    })

    var entry = new HAR.Entry({
      startedDateTime: new Date(),
      request: request,
      response: response,
      time: 10
    })

    entry.should.be.an.Object
    entry.should.have.property('time').and.equal(10)

    validator(entry).should.be.true

    done()
  })

  it('should set cache object', function (done) {
    var cache = new HAR.CacheEntry({
      expires: new Date(),
      lastAccess: new Date(),
      eTag: 'foo',
      hitCount: 0,
      comment: 'bar'
    })

    var request = new HAR.Request({
      url: 'http://localhost/'
    })

    var response = new HAR.Response({
      status: 200,
      statusText: 'OK'
    })

    var entry = new HAR.Entry({
      startedDateTime: new Date(),
      request: request,
      response: response,
      time: 10,
      cache: {
        beforeRequest: cache,
        afterRequest: cache
      }
    })

    entry.should.be.an.Object
    entry.should.have.property('cache').and.eql({
      beforeRequest: cache,
      afterRequest: cache,
      comment: undefined
    })

    validator(entry).should.be.true

    done()
  })

  it('should set timings object', function (done) {
    var timings = {
      blocked: 10,
      connect: 20,
      dns: 30,
      receive: 40,
      send: 50,
      wait: 60,
      comment: 'foo'
    }

    var request = new HAR.Request({
      url: 'http://localhost/'
    })

    var response = new HAR.Response({
      status: 200,
      statusText: 'OK'
    })

    var entry = new HAR.Entry({
      startedDateTime: new Date(),
      request: request,
      response: response,
      timings: timings
    })

    entry.should.be.an.Object
    entry.should.have.property('timings').and.eql(timings)

    validator(entry).should.be.true

    done()
  })
})
