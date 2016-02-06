/* global describe, it */

'use strict'

var Version = require('..').Version

require('should')

describe('Version', function () {
  it('should fail without version value', function (done) {
    /* eslint-disable */
    (function () {
      new Version()
    }).should.throw('version required')
    /* eslint-enable */

    done()
  })

  it('should use passed value', function (done) {
    var version = new Version('1.2')

    version.should.be.an.Object
    version.should.have.property('version').and.equal('1.2')

    done()
  })

  it('should use force to string value', function (done) {
    var comment = new Version(10.2)

    comment.should.be.an.Object
    comment.should.have.property('version').and.equal('10.2')

    done()
  })
})
