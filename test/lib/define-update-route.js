var test = require('ava')
var defineUpdateRoute = require('../../lib/define-update-route')

test('defineUpdateRoute should require a name', t => {
  t.throws(() => defineUpdateRoute())
})

test('defineUpdateRoute should return an object with a complete 200 response', t => {
  var subject = defineUpdateRoute('Widget')

  t.truthy(subject.responses)
  t.truthy(subject.responses[200])
  t.truthy(subject.responses[200].description)
  t.truthy(subject.responses[200].schema)
  t.is(subject.responses[200].schema.type, 'object')
  t.is(subject.responses[200].schema.additionalProperties, false)
  t.deepEqual(subject.responses[200].schema.required, ['data'])
  t.truthy(subject.responses[200].schema.properties)
  t.truthy(subject.responses[200].schema.properties.data)
  t.truthy(subject.responses[200].schema.properties.data.$ref)
  t.truthy(subject.responses[200].schema.properties.included)
  t.is(subject.responses[200].schema.properties.included.type, 'array')
  t.truthy(subject.responses[200].schema.properties.included.items)
  t.is(subject.responses[200].schema.properties.included.items.type, 'object')
  t.truthy(subject.responses[200].schema.properties.meta)
  t.is(subject.responses[200].schema.properties.meta.type, 'object')
})

test('defineUpdateRoute should include the passed-in options', t => {
  var subject = defineUpdateRoute('Widget', { extra: 'present' })

  t.is(subject.extra, 'present')
})

test('defineUpdateRoute should mix in options deeply', t => {
  var subject = defineUpdateRoute('Widget', {
    responses: {
      200: {
        description: 'New description'
      }
    }
  })

  t.is(subject.responses[200].description, 'New description')
  t.truthy(subject.responses[200].schema)
})

test('defineUpdateRoute should not modify the options object', t => {
  var options = {}

  defineUpdateRoute('Widget', options)

  t.deepEqual(options, {})
})

test('defineUpdateRoute should include a body parameter', t => {
  var subject = defineUpdateRoute('Widget')

  t.is(subject.parameters[0].in, 'body')
})

test('defineUpdateRoute body parameter should be named after type', t => {
  var subject = defineUpdateRoute('Widget')

  t.is(subject.parameters[0].name, 'widget')
})

test('defineUpdateRoute should not omit existing parameters', t => {
  var existingParameter = {
    name: 'test',
    in: 'query'
  }

  var subject = defineUpdateRoute('Widget', {
    parameters: [existingParameter]
  })

  t.deepEqual(subject.parameters[0], existingParameter)
  t.is(subject.parameters[1].in, 'body')
})

test('defineUpdateRoute should not override an existing body parameter', t => {
  var parameters = [{
    name: 'test',
    in: 'query'
  }, {
    name: 'whatever',
    in: 'body'
  }]

  var subject = defineUpdateRoute('Widget', { parameters: parameters })

  t.deepEqual(subject.parameters, parameters)
})
