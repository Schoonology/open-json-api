var assert = require('assert')
var flatten = require('../../lib/flatten')

function generateTestResource() {
  return {
    type: 'widgets',
    id: '777',
    attributes: {
      name: 'Test Widget',
    },
    relationships: {
      company: {
        type: 'companies',
        id: '42',
      },
    },
  }
}

module.exports = {
  'flatten collapses attributes and relationships to top-level fields': function () {
    var original = generateTestResource()

    var subject = flatten(original)

    assert.deepEqual(subject, {
      id: '777',
      name: 'Test Widget',
      company: { id: '42' },
    })
  },
  'flatten ignores missing id': function () {
    var original = generateTestResource()

    delete original.id

    var subject = flatten(original)

    assert.deepEqual(subject, {
      name: 'Test Widget',
      company: { id: '42' },
    })
  },
  'flatten ignores missing attributes': function () {
    var original = generateTestResource()

    delete original.attributes

    var subject = flatten(original)

    assert.deepEqual(subject, {
      id: '777',
      company: { id: '42' },
    })
  },
  'flatten ignores missing relationships': function () {
    var original = generateTestResource()

    delete original.relationships

    var subject = flatten(original)

    assert.deepEqual(subject, {
      id: '777',
      name: 'Test Widget',
    })
  },
  'flatten ignores invalid relationships': function () {
    var original = generateTestResource()

    delete original.relationships.company.id

    var subject = flatten(original)

    assert.deepEqual(subject, {
      id: '777',
      name: 'Test Widget',
    })
  },
  'flatten ignores empty objects': function () {
    var subject = flatten({})

    assert.deepEqual(subject, {})
  },
  'flatten returns null if the data is null': function () {
    var subject = flatten(null)

    assert.equal(subject, null)
  },
}
