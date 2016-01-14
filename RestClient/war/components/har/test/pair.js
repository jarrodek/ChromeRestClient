/* global describe, it */

'use strict'

var Header = require('..').Header

require('should')

describe('Header', function () {
  it('should use default value', function (done) {
    var header = new Header()

    header.should.be.an.Object
    header.should.have.property('name').and.be.empty
    header.should.have.property('value').and.be.empty
    header.should.have.property('comment').and.be.empty

    done()
  })

  it('should use name', function (done) {
    var header = new Header('foo')

    header.should.be.an.Object
    header.should.have.property('name').and.equal('foo')
    header.should.have.property('value').and.be.empty
    header.should.have.property('comment').and.be.empty

    done()
  })

  it('should use name & value', function (done) {
    var header = new Header('foo', 'bar')

    header.should.be.an.Object
    header.should.have.property('name').and.equal('foo')
    header.should.have.property('value').and.equal('bar')
    header.should.have.property('comment').and.be.empty

    done()
  })

  it('should use name & value & comment', function (done) {
    var header = new Header('foo', 'bar', 'hello world')

    header.should.be.an.Object
    header.should.have.property('name').and.equal('foo')
    header.should.have.property('value').and.equal('bar')
    header.should.have.property('comment').and.equal('hello world')

    done()
  })

  it('should use object', function (done) {
    var header = new Header({
      name: 'foo',
      value: 'bar',
      comment: 'hello world'
    })

    header.should.be.an.Object
    header.should.have.property('name').and.equal('foo')
    header.should.have.property('value').and.equal('bar')
    header.should.have.property('comment').and.equal('hello world')

    done()
  })
})
