var test = require('ava')
var getType = require('../../lib/get-type')
var SPEC = {
  definitions: {
    Pattern: {
      properties: {
        type: {
          type: 'string',
          pattern: 'widgets'
        }
      }
    },
    Enum: {
      properties: {
        type: {
          type: 'string',
          enum: ['widgets']
        }
      }
    },
    MissingValue: {
      properties: {
        type: {
          type: 'string'
        }
      }
    },
    MissingType: {
    }
  }
}

test('getType returns type in definition with pattern', t => {
  var subject = getType(SPEC, 'Pattern')

  t.is(subject, 'widgets')
})

test('getType returns type in definition with enum', t => {
  var subject = getType(SPEC, 'Enum')

  t.is(subject, 'widgets')
})

test('getType returns null if type value is missing', t => {
  var subject = getType(SPEC, 'MissingValue')

  t.is(subject, null)
})

test('getType returns null if type is missing', t => {
  var subject = getType(SPEC, 'MissingType')

  t.is(subject, null)
})

test('getType throws if spec is null', t => {
  t.throws(function () {
    getType(null, 'Pattern')
  })
})

test('getType throws if spec is not an object', t => {
  t.throws(function () {
    getType(42)
  })
})

test('getType throws if spec has no definitions', t => {
  t.throws(function () {
    getType({}, 'Pattern')
  })
})

test('getType throws if name is not defined', t => {
  t.throws(function () {
    getType(SPEC, 'DoesNotExist')
  })
})
