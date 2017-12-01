var test = require('ava')
var defineSearchRoute = require('../../lib/define-search-route')

test('defineSearchRoute should require a name', t => {
  t.throws(() => defineSearchRoute())
})

test('defineSearchRoute should return an object with a complete 200 response', t => {
  var subject = defineSearchRoute('Widget')

  t.truthy(subject.responses)
  t.truthy(subject.responses[200])
  t.truthy(subject.responses[200].description)
  t.truthy(subject.responses[200].schema)
  t.is(subject.responses[200].schema.type, 'object')
  t.is(subject.responses[200].schema.additionalProperties, false)
  t.deepEqual(subject.responses[200].schema.required, ['data'])
  t.truthy(subject.responses[200].schema.properties)
  t.truthy(subject.responses[200].schema.properties.data)
  t.is(subject.responses[200].schema.properties.data.type, 'array')
  t.truthy(subject.responses[200].schema.properties.data.items)
})

test('defineSearchRoute should include the passed-in options', t => {
  var subject = defineSearchRoute('Widget', { extra: 'present' })

  t.is(subject.extra, 'present')
})

test('defineSearchRoute should mix in options deeply', t => {
  var subject = defineSearchRoute('Widget', {
    responses: {
      200: {
        description: 'New description'
      }
    }
  })

  t.is(subject.responses[200].description, 'New description')
  t.truthy(subject.responses[200].schema)
})

test('defineSearchRoute should not modify the options object', t => {
  var options = {}

  defineSearchRoute('Widget', options)

  t.deepEqual(options, {})
})
