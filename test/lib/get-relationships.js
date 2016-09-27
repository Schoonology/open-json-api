var assert = require('assert')
var getRelationships = require('../../lib/get-relationships')
var SPEC = {
  definitions: {
    CompanyIdentifier: {
      properties: {
        type: {
          pattern: 'companies',
        },
      },
    },
    Widget: {
      properties: {
        relationships: {
          properties: {
            company: {
              $ref: '#/definitions/CompanyIdentifier',
            },
          },
        },
      },
    },
    BadPath: {
      properties: {
        relationships: {
          properties: {
            company: {
              $ref: 'wrong/CompanyIdentifier',
            },
          },
        },
      },
    },
    BadName: {
      properties: {
        relationships: {
          properties: {
            company: {
              $ref: '#/definitions/Company',
            },
          },
        },
      },
    },
    NoName: {
      properties: {
        relationships: {
          properties: {
            company: {
            },
          },
        },
      },
    },
  },
}

module.exports = {
  'getRelationships returns defined relationships from data': function () {
    var widget = {
      company: {
        id: 42,
      },
    }
    var subject = getRelationships(SPEC, 'Widget', widget)

    assert.deepEqual(subject, {
      company: {
        type: 'companies',
        id: '42',
      },
    })
  },
  'getRelationships ignores extra attributes in data': function () {
    var widget = {
      company: {
        id: 42,
      },
      extra: true
    }
    var subject = getRelationships(SPEC, 'Widget', widget)

    assert.equal(typeof subject.extra, 'undefined')
  },
  'getRelationships ignores missing attributes in data': function () {
    var widget = {}
    var subject = getRelationships(SPEC, 'Widget', widget)

    assert.deepEqual(subject, {})
  },
  'getRelationships returns null if data is null': function () {
    var subject = getRelationships(SPEC, 'Widget', null)

    assert.equal(subject, null)
  },
  'getRelationships throws if spec is null': function () {
    assert.throws(function () {
      getRelationships(null, 'Widget', {})
    })
  },
  'getRelationships throws if spec is not an object': function () {
    assert.throws(function () {
      getRelationships(42, 'Widget', {})
    })
  },
  'getRelationships throws if spec has no definitions': function () {
    assert.throws(function () {
      getRelationships({}, 'Widget', {})
    })
  },
  'getRelationships throws if name is not defined': function () {
    assert.throws(function () {
      getRelationships(SPEC, 'DoesNotExist', {})
    })
  },
  'getRelationships throws if identifier path is bad': function () {
    var widget = {
      company: {
        id: 42,
      },
    }

    assert.throws(function () {
      getRelationships(SPEC, 'BadPath', widget)
    })
  },
  'getRelationships throws if identifier name is bad': function () {
    var widget = {
      company: {
        id: 42,
      },
    }

    assert.throws(function () {
      getRelationships(SPEC, 'BadName', widget)
    })
  },
  'getRelationships throws if identifier reference is missing': function () {
    var widget = {
      company: {
        id: 42,
      },
    }

    assert.throws(function () {
      getRelationships(SPEC, 'NoName', widget)
    })
  },
}
