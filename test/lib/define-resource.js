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

test('defineResource adds the named definition non-destructively', t => {
  var spec = {
    definitions: {
      'Existing': {},
    },
  }

  var subject = defineResource(spec, 'Widget', { type: 'widgets' })

  t.deepEqual(subject.definitions.Existing, spec.definitions.Existing)
})

test('defineResource adds the specified type to the definition', t => {
  var spec = {}

  var subject = defineResource(spec, 'Widget', {
    type: 'widgets',
  })

  t.is(getType(subject, 'Widget'), 'widgets')
})

test('defineResource adds an id property to the definition', t => {
  var spec = {}

  var subject = defineResource(spec, 'Widget', { type: 'widgets' })

  // TODO(schoon) - Remove hardcoded path here?
  t.is(subject.definitions.Widget.properties.id.type, 'string')
})

test('defineResource adds provided attributes to the definition', t => {
  var spec = {}

  var subject = defineResource(spec, 'Widget', {
    type: 'widgets',
    attributes: {
      name: {
        type: 'string',
      },
    },
  })

  t.deepEqual(
    getAttributes(subject, 'Widget', { name: 'This is a test.' }),
    { name: 'This is a test.' }
  )
})

test('defineResource adds provided to-one relationships to the definition', t => {
  var spec = {}

  var subject = defineResource(spec, 'Company', {
    type: 'companies'
  })
  subject = defineResource(subject, 'Widget', {
    type: 'widgets',
    relationships: {
      company: 'Company',
    },
  })

  t.deepEqual(
    getRelationships(subject, 'Widget', { company: { id: 42 } }),
    { company: { type: 'companies', id: '42' } }
  )
})

test('defineResource adds a named resource identifier to the spec', t => {
  var spec = {}

  var subject = defineResource(spec, 'Widget', {
    type: 'widgets',
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
  var spec = {}

  var subject = defineResource(spec, 'Widget', { type: 'widgets' })

  // TODO(schoon) - Remove hardcoded path here?
  t.is(subject.definitions.Widget.properties.attributes.type, 'object')
})

test('defineResource adds empty relationships if none specified', t => {
  var spec = {}

  var subject = defineResource(spec, 'Widget', { type: 'widgets' })

  // TODO(schoon) - Remove hardcoded path here?
  t.is(subject.definitions.Widget.properties.relationships.type, 'object')
})
