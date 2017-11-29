var test = require('ava')
var getResourceDefinition = require('../../lib/get-resource-definition')
var SPEC = {
  definitions: {
    Valid: {
      properties: {
        test_definition: true
      }
    },
    Empty: {
    }
  }
}

test('getResourceDefinition returns the definition', t => {
  var subject = getResourceDefinition(SPEC, 'Valid')

  t.is(subject.properties.test_definition, true)
})

test('getResourceDefinition fills in properties, if not specified', t => {
  var subject = getResourceDefinition(SPEC, 'Empty')

  t.true(subject.properties && typeof subject.properties === 'object')
})

test('getResourceDefinition fills in properties.attributes, if not specified', t => {
  var subject = getResourceDefinition(SPEC, 'Empty')

  t.true(subject.properties.attributes && typeof subject.properties.attributes === 'object')
})

test('getResourceDefinition fills in properties.relationships, if not specified', t => {
  var subject = getResourceDefinition(SPEC, 'Empty')

  t.true(subject.properties.relationships && typeof subject.properties.relationships === 'object')
})

test('getResourceDefinition fills in properties.attributes.properties, if not specified', t => {
  var subject = getResourceDefinition(SPEC, 'Empty')

  t.true(subject.properties.attributes.properties && typeof subject.properties.attributes.properties === 'object')
})

test('getResourceDefinition fills in properties.relationships.properties, if not specified', t => {
  var subject = getResourceDefinition(SPEC, 'Empty')

  t.true(subject.properties.relationships.properties && typeof subject.properties.relationships.properties === 'object')
})

test('getResourceDefinition fills in properties non-destructively, if not specified', t => {
  getResourceDefinition(SPEC, 'Empty')

  t.is(SPEC.definitions.Empty.properties, undefined)
})

test('getResourceDefinition throws if spec is null', t => {
  t.throws(function () {
    getResourceDefinition(null, 'Valid')
  })
})

test('getResourceDefinition throws if spec is not an object', t => {
  t.throws(function () {
    getResourceDefinition(42)
  })
})

test('getResourceDefinition throws if spec has no definitions', t => {
  t.throws(function () {
    getResourceDefinition({}, 'Valid')
  })
})

test('getResourceDefinition throws if name is not defined', t => {
  t.throws(function () {
    getResourceDefinition(SPEC, 'DoesNotExist')
  })
})
