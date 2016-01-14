/* global describe, it */

'use strict'

var CacheEntry = require('..').CacheEntry

require('should')

describe('CacheEntry', function () {
  it('should use default value', function (done) {
    var cache = new CacheEntry()

    cache.should.be.an.Object
    cache.should.have.property('eTag').and.be.empty
    cache.should.have.property('hitCount').and.be.empty
    cache.should.have.property('expires').and.be.empty
    cache.should.have.property('lastAccess').and.be.empty
    cache.should.have.property('comment').and.be.empty

    done()
  })

  it('should use passed object', function (done) {
    var date = new Date().toISOString()

    var cache = new CacheEntry({
      eTag: 'foo',
      hitCount: 10,
      expires: date,
      lastAccess: date,
      comment: 'foo'
    })

    cache.should.be.an.Object
    cache.should.have.property('eTag').and.equal('foo')
    cache.should.have.property('hitCount').and.equal(10)
    cache.should.have.property('expires').and.equal(date)
    cache.should.have.property('lastAccess').and.equal(date)
    cache.should.have.property('comment').and.equal('foo')

    done()
  })
})
