var test = require('ava')
var defineGetRoute = require('../../lib/define-get-route')

test('defineGetRoute should require a name', t => {
  t.throws(() => defineGetRoute())
})

test('defineGetRoute should return an object with a complete 200 response', t => {
  var subject = defineGetRoute('Widget')

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
  t.truthy(subject.responses[200].schema.properties.meta)
  t.is(subject.responses[200].schema.properties.meta.type, 'object')
})

test('defineGetRoute should include the passed-in options', t => {
  var subject = defineGetRoute('Widget', { extra: 'present' })

  t.is(subject.extra, 'present')
})

test('defineGetRoute should mix in options deeply', t => {
  var subject = defineGetRoute('Widget', {
    responses: {
      200: {
        description: 'New description'
      }
    }
  })

  t.is(subject.responses[200].description, 'New description')
  t.truthy(subject.responses[200].schema)
})

test('defineGetRoute should not modify the options object', t => {
  var options = {}

  defineGetRoute('Widget', options)

  t.deepEqual(options, {})
})

test('defineGetRoute should add include parameter when withIncludes is present', t => {
  var subject = defineGetRoute('Widget', {
    withIncludes: {
      'company': 'Company'
    }
  })

  t.deepEqual(subject.parameters, [{
    name: 'include',
    in: 'query',
    type: 'array',
    items: {
      type: 'string',
      enum: ['company']
    }
  }])
})

test('defineGetRoute should add included response body based on withIncludes', t => {
  var subject = defineGetRoute('Widget', {
    withIncludes: {
      'company': 'companies'
    }
  })

  t.deepEqual(subject.responses[200].schema.properties.included, {
    type: 'array',
    items: {
      type: 'object',
      required: ['type'],
      properties: {
        type: {
          enum: ['companies']
        }
      }
    }
  })
})
