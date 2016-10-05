var assert = require('assert')
var td = require('testdouble')
var getAttributes = td.replace('../../lib/get-attributes')
var getRelationships = td.replace('../../lib/get-relationships')
var getType = td.replace('../../lib/get-type')
var normalize = require('../../lib/normalize')
var SPEC = {}

module.exports = {
  afterAll: function () {
    td.reset()
  },
  'normalize': function () {
    var original = { id: 777 }
    var attrs = {}
    var rels = {}

    td.when(getType(SPEC, 'Widget')).thenReturn('widgets')
    td.when(getAttributes(SPEC, 'Widget', original)).thenReturn(attrs)
    td.when(getRelationships(SPEC, 'Widget', original)).thenReturn(rels)

    var subject = normalize(SPEC, 'Widget', original)

    assert.deepEqual(subject, {
      type: 'widgets',
      id: '777',
      attributes: attrs,
      relationships: rels,
    })
  },
  'normalize should not require an id': function () {
    var original = {}
    var attrs = {}
    var rels = {}

    td.when(getType(SPEC, 'Widget')).thenReturn('widgets')
    td.when(getAttributes(SPEC, 'Widget', original)).thenReturn(attrs)
    td.when(getRelationships(SPEC, 'Widget', original)).thenReturn(rels)

    var subject = normalize(SPEC, 'Widget', original)

    assert.deepEqual(subject, {
      type: 'widgets',
      attributes: attrs,
      relationships: rels,
    })
  },
}
