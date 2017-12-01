var test = require('ava')
var defineCreateRoute = require('../../lib/define-create-route')

test('defineCreateRoute should require a name', t => {
  t.throws(() => defineCreateRoute())
})

test('defineCreateRoute should return an object with a complete 201 response', t => {
  var subject = defineCreateRoute('Widget')

  t.truthy(subject.responses)
  t.truthy(subject.responses[201])
  t.truthy(subject.responses[201].description)
  t.truthy(subject.responses[201].schema)
  t.is(subject.responses[201].schema.type, 'object')
  t.is(subject.responses[201].schema.additionalProperties, false)
  t.deepEqual(subject.responses[201].schema.required, ['data'])
  t.truthy(subject.responses[201].schema.properties)
  t.truthy(subject.responses[201].schema.properties.data)
  t.truthy(subject.responses[201].schema.properties.data.$ref)
  t.truthy(subject.responses[201].schema.properties.included)
  t.is(subject.responses[201].schema.properties.included.type, 'array')
  t.truthy(subject.responses[201].schema.properties.included.items)
  t.is(subject.responses[201].schema.properties.included.items.type, 'object')
  t.truthy(subject.responses[201].schema.properties.meta)
  t.is(subject.responses[201].schema.properties.meta.type, 'object')
})

test('defineCreateRoute should include the passed-in options', t => {
  var subject = defineCreateRoute('Widget', { extra: 'present' })

  t.is(subject.extra, 'present')
})

test('defineCreateRoute should mix in options deeply', t => {
  var subject = defineCreateRoute('Widget', {
    responses: {
      201: {
        description: 'New description'
      }
    }
  })

  t.is(subject.responses[201].description, 'New description')
  t.truthy(subject.responses[201].schema)
})

test('defineCreateRoute should not modify the options object', t => {
  var options = {}

  defineCreateRoute('Widget', options)

  t.deepEqual(options, {})
})

test('defineCreateRoute should include a body parameter', t => {
  var subject = defineCreateRoute('Widget')

  t.is(subject.parameters[0].in, 'body')
})

test('defineCreateRoute body parameter should be named after type', t => {
  var subject = defineCreateRoute('Widget')

  t.is(subject.parameters[0].name, 'widget')
})

test('defineCreateRoute should not omit existing parameters', t => {
  var existingParameter = {
    name: 'test',
    in: 'query'
  }

  var subject = defineCreateRoute('Widget', {
    parameters: [existingParameter]
  })

  t.deepEqual(subject.parameters[0], existingParameter)
  t.is(subject.parameters[1].in, 'body')
})

test('defineCreateRoute should not override an existing body parameter', t => {
  var parameters = [{
    name: 'test',
    in: 'query'
  }, {
    name: 'whatever',
    in: 'body'
  }]

  var subject = defineCreateRoute('Widget', { parameters: parameters })

  t.deepEqual(subject.parameters, parameters)
})
