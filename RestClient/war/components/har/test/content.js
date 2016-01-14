/* global describe, it */

'use strict'

var Content = require('..').Content

require('should')

describe('Content', function () {
  it('should use default values', function (done) {
    var content = new Content()

    content.should.be.an.Object
    content.should.have.property('size').and.be.empty
    content.should.have.property('compression').and.be.empty
    content.should.have.property('mimeType').and.equal('application/octet-stream')
    content.should.have.property('text').and.be.empty
    content.should.have.property('encoding').and.be.empty
    content.should.have.property('comment').and.be.empty

    done()
  })

  it('should use object', function (done) {
    var content = new Content({
      compression: 20,
      mimeType: 'multipart/form-content',
      text: 'foo=bar',
      encoding: 'base64',
      comment: 'hello world'
    })

    content.should.be.an.Object
    content.should.have.property('compression').and.equal(20)
    content.should.have.property('mimeType').and.equal('multipart/form-content')
    content.should.have.property('text').and.equal('foo=bar')
    content.should.have.property('encoding').and.equal('base64')
    content.should.have.property('size').and.equal(7)

    done()
  })

  it('should manually override params', function (done) {
    var content = new Content()

    content.compression = 20
    content.mimeType = 'multipart/form-content'
    content.text = 'foo=bar'
    content.encoding = 'base64'
    content.comment = 'hello world'

    content.should.be.an.Object
    content.should.have.property('compression').and.equal(20)
    content.should.have.property('mimeType').and.equal('multipart/form-content')
    content.should.have.property('text').and.equal('foo=bar')
    content.should.have.property('encoding').and.equal('base64')
    content.should.have.property('size').and.equal(7)

    done()
  })

  it('should not allow setting size value', function (done) {
    /* eslint-disable */
    (function () {
      var content = new Content()

      content.size = 2
    }).should.throw('not allowed')
    /* eslint-enable */

    done()
  })
})
