/* global describe, it */

'use strict'

var Util = require('../lib/util')

require('should')

describe('Util', function () {
  it('should convert a regular object to a HAR array pair', function (done) {
    var obj = Util.toArray({
      foo: 'bar',
      key: 'value'
    })

    obj.should.be.an.Array
    obj.should.be.eql([
      { name: 'foo', value: 'bar' },
      { name: 'key', value: 'value' }
    ])

    done()
  })

  it('should convert a HAR array pair to a regular object', function (done) {
    var obj = Util.toObject([
      {name: 'key', value: 'value'},
      {name: 'foo', value: 'bar1'},
      {name: 'foo', value: 'bar2'}
    ])

    obj.should.be.an.Object
    obj.should.be.eql({key: 'value', foo: ['bar1', 'bar2']})

    done()
  })
})
