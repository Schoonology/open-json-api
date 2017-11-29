var test = require('ava')
var getAttributes = require('../../lib/get-attributes')
var SPEC = {
  definitions: {
    Widget: {
      properties: {
        attributes: {
          properties: {
            name: {
              type: 'string'
            },
            price: {
              type: 'number'
            }
          }
        }
      }
    }
  }
}

test('getAttributes returns defined attributes from data', t => {
  var widget = {
    name: 'Test Widget',
    price: 42
  }
  var subject = getAttributes(SPEC, 'Widget', widget)

  t.deepEqual(subject, widget)
})

test('getAttributes ignores extra attributes in data', t => {
  var widget = {
    name: 'Test Widget',
    price: 42,
    extra: true
  }
  var subject = getAttributes(SPEC, 'Widget', widget)

  t.is(typeof subject.extra, 'undefined')
})

test('getAttributes ignores missing attributes in data', t => {
  var widget = {}
  var subject = getAttributes(SPEC, 'Widget', widget)

  t.deepEqual(subject, {})
})

test('getAttributes casts attributes based on defined type', t => {
  var widget = {
    name: Buffer.from('New Widget'),
    price: '42.99'
  }
  var subject = getAttributes(SPEC, 'Widget', widget)

  t.deepEqual(subject, {
    name: String(widget.name),
    price: Number(widget.price)
  })
})

test('getAttributes preserves existing attributes', t => {
  var widget = {
    attributes: {
      name: 'Test Widget',
      price: 42
    }
  }
  var subject = getAttributes(SPEC, 'Widget', widget)

  t.deepEqual(subject, widget.attributes)
})

test('getAttributes prefers existing attributes', t => {
  var widget = {
    name: 'Test Widget',
    price: 23,
    attributes: {
      price: 42
    }
  }
  var subject = getAttributes(SPEC, 'Widget', widget)

  t.deepEqual(subject, widget.attributes)
})

test('getAttributes returns null if data is null', t => {
  var subject = getAttributes(SPEC, 'Widget', null)

  t.is(subject, null)
})

test('getAttributes throws if spec is null', t => {
  t.throws(function () {
    getAttributes(null, 'Widget')
  })
})

test('getAttributes throws if spec is not an object', t => {
  t.throws(function () {
    getAttributes(42)
  })
})

test('getAttributes throws if spec has no definitions', t => {
  t.throws(function () {
    getAttributes({}, 'Widget')
  })
})

test('getAttributes throws if name is not defined', t => {
  t.throws(function () {
    getAttributes(SPEC, 'DoesNotExist')
  })
})
