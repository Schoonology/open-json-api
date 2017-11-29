var test = require('ava')
var flatten = require('../../lib/flatten')

function generateTestResource () {
  return {
    type: 'widgets',
    id: '777',
    attributes: {
      name: 'Test Widget'
    },
    relationships: {
      company: {
        type: 'companies',
        id: '42'
      }
    }
  }
}

test('flatten collapses attributes and relationships to top-level fields', t => {
  var original = generateTestResource()

  var subject = flatten(original)

  t.deepEqual(subject, {
    id: '777',
    name: 'Test Widget',
    company: { id: '42' }
  })
})

test('flatten ignores missing id', t => {
  var original = generateTestResource()

  delete original.id

  var subject = flatten(original)

  t.deepEqual(subject, {
    name: 'Test Widget',
    company: { id: '42' }
  })
})

test('flatten ignores missing attributes', t => {
  var original = generateTestResource()

  delete original.attributes

  var subject = flatten(original)

  t.deepEqual(subject, {
    id: '777',
    company: { id: '42' }
  })
})

test('flatten ignores missing relationships', t => {
  var original = generateTestResource()

  delete original.relationships

  var subject = flatten(original)

  t.deepEqual(subject, {
    id: '777',
    name: 'Test Widget'
  })
})

test('flatten ignores invalid relationships', t => {
  var original = generateTestResource()

  delete original.relationships.company.id

  var subject = flatten(original)

  t.deepEqual(subject, {
    id: '777',
    name: 'Test Widget'
  })
})

test('flatten ignores empty objects', t => {
  var subject = flatten({})

  t.deepEqual(subject, {})
})

test('flatten returns null if the data is null', t => {
  var subject = flatten(null)

  t.is(subject, null)
})

test('flatten returns already-flatten objects unharmed', t => {
  var original = flatten(generateTestResource())

  var subject = flatten(original)

  t.deepEqual(original, subject)
})
