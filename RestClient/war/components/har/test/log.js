/* global describe, it */

'use strict'

var HAR = require('..')
var validator = require('har-validator').log

var creator = new HAR.Creator({
  name: 'test',
  version: '1.0'
})

require('should')

describe('Log', function () {
  it('should fail without required params', function (done) {
    /* eslint-disable */
    (function () {
      new HAR.Log()
    }).should.throw('version required')
    /* eslint-enable */

    done()
  })

  it('should create a log object with minimal values', function (done) {
    var log = new HAR.Log({
      version: '1.2',
      creator: creator
    })

    log.should.be.an.Object
    log.should.have.property('version').and.equal('1.2')
    log.should.have.property('browser').and.be.empty
    log.should.have.property('creator').and.eql(creator)
    log.should.have.property('pages').and.be.an.Array.and.be.empty
    log.should.have.property('entries').and.be.an.Array.and.be.empty
    log.should.have.property('comment').and.be.empty

    validator(log).should.be.true

    done()
  })

  it('should create browser object', function (done) {
    var log = new HAR.Log({
      version: '1.2',
      creator: creator,
      browser: {
        name: 'browser',
        version: '1.0'
      }
    })

    log.should.be.an.Object
    log.should.have.property('version').and.equal('1.2')
    log.should.have.property('creator').and.eql(creator)
    log.should.have.property('pages').and.be.an.Array.and.be.empty
    log.should.have.property('entries').and.be.an.Array.and.be.empty
    log.should.have.property('comment').and.be.empty
    log.should.have.property('browser').and.eql({
      name: 'browser',
      version: '1.0',
      comment: undefined
    })

    validator(log).should.be.true

    done()
  })

  describe('Pages', function () {
    it('should add a single page using an object', function (done) {
      var page = {
        id: 'hello',
        title: 'hello world',
        startedDateTime: new Date().toISOString(),
        pageTimings: {
          onLoad: 0,
          onContentLoad: 0
        },
        comment: 'foo'
      }

      var log = new HAR.Log({
        version: '1.2',
        creator: creator
      }).addPage(page)

      log.should.be.an.Object
      log.should.have.property('pages').and.eql([page])

      validator(log).should.be.true

      done()
    })

    it('should add a single page using an instance', function (done) {
      var page = new HAR.Page({
        id: 'hello',
        title: 'hello world',
        startedDateTime: new Date(),
        pageTimings: {
          onLoad: 0,
          onContentLoad: 0
        },
        comment: 'foo'
      })

      var log = new HAR.Log({
        version: '1.2',
        creator: creator
      }).addPage(page)

      log.should.be.an.Object
      log.should.have.property('pages').and.eql([page])

      validator(log).should.be.true

      done()
    })

    it('should set pages on creation', function (done) {
      var page = {
        id: 'hello',
        title: 'hello world',
        startedDateTime: new Date().toISOString(),
        pageTimings: {
          onLoad: 0,
          onContentLoad: 0
        },
        comment: 'foo'
      }

      var log = new HAR.Log({
        version: '1.2',
        creator: creator,
        pages: [page]
      })

      log.should.be.an.Object
      log.should.have.property('pages').and.eql([page])

      validator(log).should.be.true

      done()
    })

    it('should set pages manually', function (done) {
      var page = {
        id: 'hello',
        title: 'hello world',
        startedDateTime: new Date().toISOString(),
        pageTimings: {
          onLoad: 0,
          onContentLoad: 0
        },
        comment: 'foo'
      }

      var log = new HAR.Log({
        version: '1.2',
        creator: creator
      })

      log.pages = [page]

      log.should.be.an.Object
      log.should.have.property('pages').and.eql([page])

      validator(log).should.be.true

      done()
    })
  })

  describe('Entries', function () {
    it('should add a single entry using constructor', function (done) {
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
        response: response
      })

      var log = new HAR.Log({
        comment: 'foo',
        creator: creator,
        version: 1.2,
        entries: [entry]
      })

      log.should.be.an.Object
      log.should.have.property('entries').and.eql([entry])

      validator(log).should.be.true

      done()
    })

    it('should add a single entry using an instance', function (done) {
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
        response: response
      })

      var log = new HAR.Log({
        version: '1.2',
        creator: creator
      }).addEntry(entry)

      log.should.be.an.Object
      log.should.have.property('entries').and.eql([entry])

      validator(log).should.be.true

      done()
    })

    it('should set entries on creation', function (done) {
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
        response: response
      })

      var log = new HAR.Log({
        version: '1.2',
        creator: creator,
        entries: [entry]
      })

      log.should.be.an.Object
      log.should.have.property('entries').and.eql([entry])

      validator(log).should.be.true

      done()
    })

    it('should set entries manually', function (done) {
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
        response: response
      })

      var log = new HAR.Log({
        version: '1.2',
        creator: creator
      })

      log.entries = [entry]

      log.should.be.an.Object
      log.should.have.property('entries').and.eql([entry])

      validator(log).should.be.true

      done()
    })
  })
})
