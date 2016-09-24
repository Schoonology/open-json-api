var assert = require('assert')
var getType = require('../../lib/get-type')
var SPEC = {
  definitions: {
    Pattern: {
      properties: {
        type: {
          type: 'string',
          pattern: 'widgets',
        },
      },
    },
    Enum: {
      properties: {
        type: {
          type: 'string',
          enum: ['widgets'],
        },
      },
    },
    MissingValue: {
      properties: {
        type: {
          type: 'string',
        },
      },
    },
    MissingType: {
    },
  },
}

module.exports = {
  'getType returns type in definition with pattern': function () {
    var subject = getType(SPEC, 'Pattern')

    assert.equal(subject, 'widgets')
  },
  'getType returns type in definition with enum': function () {
    var subject = getType(SPEC, 'Enum')

    assert.equal(subject, 'widgets')
  },
  'getType returns null if type value is missing': function () {
    var subject = getType(SPEC, 'MissingValue')

    assert.equal(subject, null)
  },
  'getType returns null if type is missing': function () {
    var subject = getType(SPEC, 'MissingType')

    assert.equal(subject, null)
  },
  'getType throws if spec is null': function () {
    assert.throws(function () {
      getType(null, 'Pattern')
    })
  },
  'getType throws if spec is not an object': function () {
    assert.throws(function () {
      getType(42)
    })
  },
  'getType throws if spec has no definitions': function () {
    assert.throws(function () {
      getType({}, 'Pattern')
    })
  },
  'getType throws if name is not defined': function () {
    assert.throws(function () {
      getType(SPEC, 'DoesNotExist')
    })
  },
}
