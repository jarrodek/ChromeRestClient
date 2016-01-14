/* global describe, it */

'use strict'

var Cookie = require('..').Cookie

require('should')

describe('Cookie', function () {
  it('should throw error when no data', function (done) {
    /* eslint-disable */
    (function () {
      new Cookie()
    }).should.throw('missing required fields')
    /* eslint-enable */

    done()
  })

  it('should throw error when no name', function (done) {
    /* eslint-disable */
    (function () {
      new Cookie({
        value: 'foo'
      })
    }).should.throw('missing required fields')
    /* eslint-enable */

    done()
  })

  it('should throw error when no value', function (done) {
    /* eslint-disable */
    (function () {
      new Cookie({
        name: 'foo'
      })
    }).should.throw('missing required fields')
    /* eslint-enable */

    done()
  })

  it('should use default values', function (done) {
    var cookie = new Cookie({
      name: 'foo',
      value: 'bar'
    })

    cookie.should.be.an.Object
    cookie.should.have.property('name').and.equal('foo')
    cookie.should.have.property('value').and.equal('bar')
    cookie.should.have.property('path').and.be.empty
    cookie.should.have.property('domain').and.be.empty
    cookie.should.have.property('expires').and.be.empty
    cookie.should.have.property('httpOnly').and.be.empty
    cookie.should.have.property('secure').and.be.empty
    cookie.should.have.property('comment').and.be.empty

    done()
  })

  it('should use object', function (done) {
    var date = new Date()
    var cookie = new Cookie({
      name: 'foo',
      value: 'bar',
      path: '/',
      domain: 'www.ahmadnassri.com',
      expires: date,
      httpOnly: true,
      secure: true,
      comment: 'foo'
    })

    cookie.should.be.an.Object
    cookie.should.have.property('name').and.equal('foo')
    cookie.should.have.property('value').and.equal('bar')
    cookie.should.have.property('path').and.equal('/')
    cookie.should.have.property('domain').and.equal('www.ahmadnassri.com')
    cookie.should.have.property('expires').and.equal(date.toISOString())
    cookie.should.have.property('httpOnly').and.equal(true)
    cookie.should.have.property('secure').and.equal(true)
    cookie.should.have.property('comment').and.equal('foo')

    done()
  })
})
