/* global describe, it */

'use strict'

var Creator = require('..').Creator
var validator = require('har-validator').creator

require('should')

describe('Creator', function () {
  it('should throw error when no name', function (done) {
    /* eslint-disable */
    (function () {
      new Creator()
    }).should.throw('name required')
    /* eslint-enable */

    done()
  })

  it('should create a creator object', function (done) {
    var creator = new Creator({
      name: 'foo',
      version: '1.0',
      comment: 'bar'
    })

    creator.should.be.an.Object
    creator.should.have.property('name').and.equal('foo')
    creator.should.have.property('version').and.equal('1.0')
    creator.should.have.property('comment').and.equal('bar')

    validator(creator).should.be.true

    done()
  })
})
