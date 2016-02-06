/* global describe, it */

'use strict'

var Param = require('..').Param

require('should')

describe('Param', function () {
  it('should use default values', function (done) {
    var param = new Param()

    param.should.be.an.Object
    param.should.have.property('name').and.be.empty
    param.should.have.property('value').and.be.empty
    param.should.have.property('fileName').and.be.empty
    param.should.have.property('contentType').and.be.empty
    param.should.have.property('comment').and.be.empty

    done()
  })

  it('should use object', function (done) {
    var param = new Param({
      name: 'foo',
      value: 'bar',
      fileName: 'foo.bar',
      contentType: 'text/plain'
    })

    param.should.be.an.Object
    param.should.have.property('name').and.equal('foo')
    param.should.have.property('value').and.equal('bar')
    param.should.have.property('fileName').and.equal('foo.bar')
    param.should.have.property('contentType').and.equal('text/plain')
    param.should.have.property('comment').and.be.empty

    done()
  })
})
