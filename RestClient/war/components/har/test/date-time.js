/* global describe, it */

'use strict'

var DateTime = require('..').DateTime

require('should')

describe('DateTime', function () {
  it('should use default values', function (done) {
    var datetime = new DateTime()

    datetime.should.be.an.Object
    datetime.should.have.property('dateTime')

    Date.parse(datetime.dateTime).should.be.a.Date

    done()
  })

  it('should use custom name value', function (done) {
    var datetime = new DateTime('foo')

    datetime.should.be.an.Object
    datetime.should.have.property('foo')

    Date.parse(datetime.foo).should.be.a.Date

    done()
  })

  it('should use string value', function (done) {
    var compare = new Date(475995600000).toDateString()
    var datetime = new DateTime('date', 'Jan 31, 1985')

    datetime.should.be.an.Object
    datetime.should.have.property('date')

    var date = new Date(Date.parse(datetime.date))

    date.should.be.a.Date
    date.toDateString().should.equal(compare)

    done()
  })

  it('should use Date value', function (done) {
    var date = new Date()
    var datetime = new DateTime('dateTime', date)

    datetime.should.be.an.Object
    datetime.should.have.property('dateTime').and.equal(date.toISOString())

    done()
  })

  it('should use Number value', function (done) {
    var compare = new Date(475995600000)
    var datetime = new DateTime('date', compare.getTime())

    datetime.should.be.an.Object
    datetime.should.have.property('date')

    var date = new Date(Date.parse(datetime.date))

    date.should.be.a.Date
    date.toDateString().should.equal(date.toDateString())

    done()
  })
})
