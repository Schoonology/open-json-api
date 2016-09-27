var assert = require('assert')
var getResourceDefinition = require('../../lib/get-resource-definition')
var SPEC = {
  definitions: {
    Valid: {
      properties: {
        test_definition: true,
      },
    },
    Empty: {
    },
  },
}

module.exports = {
  'getResourceDefinition returns the definition': function () {
    var subject = getResourceDefinition(SPEC, 'Valid')

    assert.equal(subject.properties.test_definition, true)
  },
  'getResourceDefinition fills in properties, if not specified': function () {
    var subject = getResourceDefinition(SPEC, 'Empty')

    assert(subject.properties && typeof subject.properties === 'object')
  },
  'getResourceDefinition fills in properties.attributes, if not specified': function () {
    var subject = getResourceDefinition(SPEC, 'Empty')

    assert(subject.properties.attributes && typeof subject.properties.attributes === 'object')
  },
  'getResourceDefinition fills in properties.relationships, if not specified': function () {
    var subject = getResourceDefinition(SPEC, 'Empty')

    assert(subject.properties.relationships && typeof subject.properties.relationships === 'object')
  },
  'getResourceDefinition fills in properties.attributes.properties, if not specified': function () {
    var subject = getResourceDefinition(SPEC, 'Empty')

    assert(subject.properties.attributes.properties && typeof subject.properties.attributes.properties === 'object')
  },
  'getResourceDefinition fills in properties.relationships.properties, if not specified': function () {
    var subject = getResourceDefinition(SPEC, 'Empty')

    assert(subject.properties.relationships.properties && typeof subject.properties.relationships.properties === 'object')
  },
  'getResourceDefinition fills in properties non-destructively, if not specified': function () {
    var subject = getResourceDefinition(SPEC, 'Empty')

    assert.equal(SPEC.definitions.Empty.properties, null)
  },
  'getResourceDefinition throws if spec is null': function () {
    assert.throws(function () {
      getResourceDefinition(null, 'Valid')
    })
  },
  'getResourceDefinition throws if spec is not an object': function () {
    assert.throws(function () {
      getResourceDefinition(42)
    })
  },
  'getResourceDefinition throws if spec has no definitions': function () {
    assert.throws(function () {
      getResourceDefinition({}, 'Valid')
    })
  },
  'getResourceDefinition throws if name is not defined': function () {
    assert.throws(function () {
      getResourceDefinition(SPEC, 'DoesNotExist')
    })
  },
}
