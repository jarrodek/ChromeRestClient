/* global describe, it */

'use strict'

var PostData = require('..').PostData

require('should')

describe('PostData', function () {
  it('should use default values', function (done) {
    var data = new PostData()

    data.should.be.an.Object
    data.should.have.property('params').and.be.empty
    data.should.have.property('text').and.be.empty
    data.should.have.property('comment').and.be.empty
    data.should.have.property('mimeType').and.equal('application/octet-stream')

    done()
  })

  it('should use object', function (done) {
    var data = new PostData({
      comment: 'hello world',
      mimeType: 'multipart/form-data',
      text: 'foo=bar',
      params: [{
        comment: 'hello',
        contentType: 'text/plain',
        fileName: 'foo.bar',
        name: 'foo',
        value: 'bar'
      }]
    })

    data.should.be.an.Object
    data.should.have.property('text').and.equal('foo=bar')
    data.should.have.property('comment').and.equal('hello world')
    data.should.have.property('mimeType').and.equal('multipart/form-data')
    data.should.have.property('params').and.eql([{
      comment: 'hello',
      contentType: 'text/plain',
      fileName: 'foo.bar',
      name: 'foo',
      value: 'bar'
    }])

    done()
  })

  it('should add a param', function (done) {
    var data = new PostData({
      comment: 'hello world',
      mimeType: 'multipart/form-data',
      text: 'foo=bar'
    })

    data.addParam({
      comment: 'hello',
      contentType: 'text/plain',
      fileName: 'foo.bar',
      name: 'foo',
      value: 'bar'
    })

    data.should.be.an.Object
    data.should.have.property('text').and.equal('foo=bar')
    data.should.have.property('comment').and.equal('hello world')
    data.should.have.property('mimeType').and.equal('multipart/form-data')
    data.should.have.property('params').and.eql([{
      comment: 'hello',
      contentType: 'text/plain',
      fileName: 'foo.bar',
      name: 'foo',
      value: 'bar'
    }])

    done()
  })

  it('should manually override params', function (done) {
    var data = new PostData({
      comment: 'hello world',
      mimeType: 'multipart/form-data',
      text: 'foo=bar'
    })

    data.params = [{
      comment: 'hello',
      contentType: 'text/plain',
      fileName: 'foo.bar',
      name: 'foo',
      value: 'bar'
    }]

    data.should.be.an.Object
    data.should.have.property('text').and.equal('foo=bar')
    data.should.have.property('comment').and.equal('hello world')
    data.should.have.property('mimeType').and.equal('multipart/form-data')
    data.should.have.property('params').and.eql([{
      comment: 'hello',
      contentType: 'text/plain',
      fileName: 'foo.bar',
      name: 'foo',
      value: 'bar'
    }])

    done()
  })
})
