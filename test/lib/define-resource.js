var test = require('ava')
var defineResource = require('../../lib/define-resource')
var getAttributes = require('../../lib/get-attributes')
var getRelationships = require('../../lib/get-relationships')
var getType = require('../../lib/get-type')

test('defineResource returns a new spec', t => {
  var spec = {}

  var subject = defineResource(spec, 'Widget', { type: 'widgets' })

  t.not(spec, subject)
})

test('defineResource adds a definitions block to the spec', t => {
  var spec = {}

  var subject = defineResource(spec, 'Widget', { type: 'widgets' })

  t.is(typeof subject.definitions, 'object')
})

test('defineResource adds the named definition to the spec', t => {
  var spec = {}

  var subject = defineResource(spec, 'Widget', { type: 'widgets' })

  t.is(typeof subject.definitions.Widget, 'object')
})

test('defineResource adds a named definition for an identifier to the spec', t => {
  var spec = {}

  var subject = defineResource(spec, 'Widget', { type: 'widgets' })

  t.is(typeof subject.definitions.WidgetIdentifier, 'object')
})

test('defineResource adds the named definition non-destructively', t => {
  var spec = {
    definitions: {
      'Existing': {}
    }
  }

  var subject = defineResource(spec, 'Widget', { type: 'widgets' })

  t.deepEqual(subject.definitions.Existing, spec.definitions.Existing)
})

test('defineResource does not modify passed-in object', t => {
  var spec = {}

  defineResource(spec, 'Widget', { type: 'widgets' })

  t.deepEqual(spec, spec)
})

test('defineResource adds the specified type to the definition', t => {
  var subject = defineResource({}, 'Widget', {
    type: 'widgets'
  })

  t.is(getType(subject, 'Widget'), 'widgets')
})

test('defineResource adds an id property to the definition', t => {
  var subject = defineResource({}, 'Widget', { type: 'widgets' })

  t.is(subject.definitions.Widget.properties.id.type, 'string')
})

test('defineResource adds provided attributes to the definition', t => {
  var subject = defineResource({}, 'Widget', {
    type: 'widgets',
    attributes: {
      name: {
        type: 'string'
      }
    }
  })

  t.deepEqual(
    getAttributes(subject, 'Widget', { name: 'This is a test.' }),
    { name: 'This is a test.' }
  )
})

test('defineResource adds provided to-one relationships to the definition', t => {
  var subject = defineResource({}, 'Company', {
    type: 'companies'
  })
  subject = defineResource(subject, 'Widget', {
    type: 'widgets',
    relationships: {
      company: 'Company'
    }
  })

  t.deepEqual(
    getRelationships(subject, 'Widget', { company: { id: 42 } }),
    { company: { data: { type: 'companies', id: '42' } } }
  )
})

test('defineResource adds provided to-many relationships to the definition', t => {
  var subject = defineResource({}, 'Part', {
    type: 'parts'
  })
  subject = defineResource(subject, 'Widget', {
    type: 'widgets',
    relationships: {
      contents: ['Part']
    }
  })

  t.deepEqual(
    getRelationships(subject, 'Widget', { contents: [{ id: 42 }] }),
    { contents: { data: [{ type: 'parts', id: '42' }] } }
  )
})

test('defineResource adds provided to-one relationships to the definition with metadata', t => {
  var subject = defineResource({}, 'Company', {
    type: 'companies'
  })
  subject = defineResource(subject, 'Widget', {
    type: 'widgets',
    relationships: {
      company: {
        name: 'Company',
        meta: {
          value: {
            type: 'string'
          }
        }
      }
    }
  })

  t.deepEqual(
    getRelationships(subject, 'Widget', { company: { id: 42, value: 'foo' } }),
    { company: { data: { type: 'companies', id: '42', meta: { value: 'foo' } } } }
  )
})

test('defineResource adds a named resource identifier to the spec', t => {
  var subject = defineResource({}, 'Widget', {
    type: 'widgets'
  })

  t.is(getType(subject, 'WidgetIdentifier'), 'widgets')
})

test('defineResource throws if no name is specified', t => {
  t.throws(function () {
    defineResource({}, null, { type: 'widgets' })
  })
})

test('defineResource throws if type is not specified', t => {
  t.throws(function () {
    defineResource({}, 'Widget', {})
  })
})

test('defineResource adds empty attributes if none specified', t => {
  var subject = defineResource({}, 'Widget', { type: 'widgets' })

  t.is(subject.definitions.Widget.properties.attributes.type, 'object')
})

test('defineResource adds empty relationships if none specified', t => {
  var subject = defineResource({}, 'Widget', { type: 'widgets' })

  // TODO(schoon) - Remove hardcoded path here?
  t.is(subject.definitions.Widget.properties.relationships.type, 'object')
})
