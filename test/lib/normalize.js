var test = require('ava')
var td = require('testdouble')
var getAttributes = td.replace('../../lib/get-attributes')
var getLinks = td.replace('../../lib/get-links')
var getRelationships = td.replace('../../lib/get-relationships')
var getType = td.replace('../../lib/get-type')
var normalize = require('../../lib/normalize')
var SPEC = {}

test.after(t => {
  td.reset()
})

test('normalize', t => {
  var original = { id: 777 }
  var attrs = {}
  var rels = {}

  td.when(getType(SPEC, 'Widget')).thenReturn('widgets')
  td.when(getAttributes(SPEC, 'Widget', original)).thenReturn(attrs)
  td.when(getRelationships(SPEC, 'Widget', original)).thenReturn(rels)

  var subject = normalize(SPEC, 'Widget', original)

  t.deepEqual(subject, {
    type: 'widgets',
    id: '777',
    attributes: attrs,
    relationships: rels,
  })
})

test('normalize should not require an id', t => {
  var original = {}
  var attrs = {}
  var rels = {}

  td.when(getType(SPEC, 'Widget')).thenReturn('widgets')
  td.when(getAttributes(SPEC, 'Widget', original)).thenReturn(attrs)
  td.when(getRelationships(SPEC, 'Widget', original)).thenReturn(rels)

  var subject = normalize(SPEC, 'Widget', original)

  t.deepEqual(subject, {
    type: 'widgets',
    attributes: attrs,
    relationships: rels,
  })
})
