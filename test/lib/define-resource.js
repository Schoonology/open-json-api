var assert = require('assert')
var defineResource = require('../../lib/define-resource')
var getAttributes = require('../../lib/get-attributes')
var getRelationships = require('../../lib/get-relationships')
var getType = require('../../lib/get-type')

module.exports = {
  'defineResource returns a new spec': function () {
    var spec = {}

    var subject = defineResource(spec, 'Widget', { type: 'widgets' })

    assert.notEqual(spec, subject)
  },
  'defineResource adds a definitions block to the spec': function () {
    var spec = {}

    var subject = defineResource(spec, 'Widget', { type: 'widgets' })

    assert.equal(typeof subject.definitions, 'object')
  },
  'defineResource adds the named definition to the spec': function () {
    var spec = {}

    var subject = defineResource(spec, 'Widget', { type: 'widgets' })

    assert.equal(typeof subject.definitions.Widget, 'object')
  },
  'defineResource adds the named definition non-destructively': function () {
    var spec = {
      definitions: {
        'Existing': {},
      },
    }

    var subject = defineResource(spec, 'Widget', { type: 'widgets' })

    assert.deepEqual(subject.definitions.Existing, spec.definitions.Existing)
  },
  'defineResource adds the specified type to the definition': function () {
    var spec = {}

    var subject = defineResource(spec, 'Widget', {
      type: 'widgets',
    })

    assert.equal(getType(subject, 'Widget'), 'widgets')
  },
  'defineResource adds an id property to the definition': function () {
    var spec = {}

    var subject = defineResource(spec, 'Widget', { type: 'widgets' })

    // TODO(schoon) - Remove hardcoded path here?
    assert.equal(subject.definitions.Widget.properties.id.type, 'string')
  },
  'defineResource adds provided attributes to the definition': function () {
    var spec = {}

    var subject = defineResource(spec, 'Widget', {
      type: 'widgets',
      attributes: {
        name: {
          type: 'string',
        },
      },
    })

    assert.deepEqual(
      getAttributes(subject, 'Widget', { name: 'This is a test.' }),
      { name: 'This is a test.' }
    )
  },
  'defineResource adds provided relationships to the definition': function () {
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

    assert.deepEqual(
      getRelationships(subject, 'Widget', { company: { id: 42 } }),
      { company: { type: 'companies', id: '42' } }
    )
  },
  'defineResource adds a named resource identifier to the spec': function () {
    var spec = {}

    var subject = defineResource(spec, 'Widget', {
      type: 'widgets',
    })

    assert.equal(getType(subject, 'WidgetIdentifier'), 'widgets')
  },
  'defineResource throws if no name is specified': function () {
    assert.throws(function () {
      defineResource({}, null, { type: 'widgets' })
    })
  },
  'defineResource throws if type is not specified': function () {
    assert.throws(function () {
      defineResource({}, 'Widget', {})
    })
  },
  'defineResource adds empty attributes if none specified': function () {
    var spec = {}

    var subject = defineResource(spec, 'Widget', { type: 'widgets' })

    // TODO(schoon) - Remove hardcoded path here?
    assert.equal(subject.definitions.Widget.properties.attributes.type, 'object')
  },
  'defineResource adds empty relationships if none specified': function () {
    var spec = {}

    var subject = defineResource(spec, 'Widget', { type: 'widgets' })

    // TODO(schoon) - Remove hardcoded path here?
    assert.equal(subject.definitions.Widget.properties.relationships.type, 'object')
  },
}
