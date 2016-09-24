var assert = require('assert')
var getAttributes = require('../../lib/get-attributes')
var SPEC = {
  definitions: {
    Widget: {
      properties: {
        attributes: {
          name: {
            type: 'string',
          },
          price: {
            type: 'number',
          },
        },
      },
    },
  },
}

module.exports = {
  'getAttributes returns defined attributes from data': function () {
    var widget = {
      name: 'Test Widget',
      price: 42,
    }
    var subject = getAttributes(SPEC, 'Widget', widget)

    assert.deepEqual(subject, widget)
  },
  'getAttributes ignores extra attributes in data': function () {
    var widget = {
      name: 'Test Widget',
      price: 42,
      extra: true
    }
    var subject = getAttributes(SPEC, 'Widget', widget)

    assert.equal(typeof subject.extra, 'undefined')
  },
  'getAttributes ignores missing attributes in data': function () {
    var widget = {}
    var subject = getAttributes(SPEC, 'Widget', widget)

    assert.deepEqual(subject, {})
  },
  'getAttributes casts attributes based on defined type': function () {
    var widget = {
      name: new Buffer('New Widget'),
      price: '42.99',
    }
    var subject = getAttributes(SPEC, 'Widget', widget)

    assert.deepEqual(subject, {
      name: String(widget.name),
      price: Number(widget.price),
    })
  },
  'getAttributes returns null if data is null': function () {
    var subject = getAttributes(SPEC, 'Widget', null)

    assert.equal(subject, null)
  },
  'getAttributes throws if spec is null': function () {
    assert.throws(function () {
      getAttributes(null, 'Widget')
    })
  },
  'getAttributes throws if spec is not an object': function () {
    assert.throws(function () {
      getAttributes(42)
    })
  },
  'getAttributes throws if spec has no definitions': function () {
    assert.throws(function () {
      getAttributes({}, 'Widget')
    })
  },
  'getAttributes throws if name is not defined': function () {
    assert.throws(function () {
      getAttributes(SPEC, 'DoesNotExist')
    })
  },
}
