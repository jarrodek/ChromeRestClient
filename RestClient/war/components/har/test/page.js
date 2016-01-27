/* global describe, it */

'use strict'

var Page = require('..').Page
var validator = require('har-validator').page

require('should')

describe('Page', function () {
  it('should create an empty object with default value', function (done) {
    var page = new Page()

    page.should.be.an.Object
    page.should.have.property('startedDateTime').and.be.empty
    page.should.have.property('id').and.have.length(10)
    page.should.have.property('title').and.be.empty
    page.should.have.property('comment').and.be.empty
    page.should.have.property('pageTimings').and.eql({
      onLoad: -1,
      onContentLoad: -1
    })

    done()
  })

  it('should create a valid object', function (done) {
    var page = new Page({
      startedDateTime: new Date()
    })

    page.should.be.an.Object

    validator(page).should.be.true

    done()
  })

  it('should create a page object with set values', function (done) {
    var date = new Date()

    var page = new Page({
      startedDateTime: date,
      id: 'hello',
      title: 'hello world',
      pageTimings: {
        onContentLoad: 10,
        onLoad: 20
      },
      comment: 'foo'
    })

    page.should.be.an.Object
    page.should.have.property('startedDateTime').and.equal(date.toISOString())
    page.should.have.property('id').and.equal('hello')
    page.should.have.property('title').and.equal('hello world')
    page.should.have.property('comment').and.equal('foo')
    page.should.have.property('pageTimings').and.eql({
      onLoad: 20,
      onContentLoad: 10
    })

    validator(page).should.be.true

    done()
  })
})
