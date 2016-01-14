/* global describe, it */

'use strict'

var Comment = require('..').Comment

require('should')

describe('Comment', function () {
  it('should use default value', function (done) {
    var comment = new Comment()

    comment.should.be.an.Object
    comment.should.have.property('comment').and.be.empty

    done()
  })

  it('should use passed value', function (done) {
    var comment = new Comment('Hello World')

    comment.should.be.an.Object
    comment.should.have.property('comment').and.equal('Hello World')

    done()
  })
})
