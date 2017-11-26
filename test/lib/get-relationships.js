var test = require('ava')
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

test('getRelationships returns defined relationships from data', t => {
  var widget = {
    company: {
      id: 42,
    },
  }
  var subject = getRelationships(SPEC, 'Widget', widget)

  t.deepEqual(subject, {
    company: {
      type: 'companies',
      id: '42',
    },
  })
})

test('getRelationships ignores extra attributes in data', t => {
  var widget = {
    company: {
      id: 42,
    },
    extra: true
  }
  var subject = getRelationships(SPEC, 'Widget', widget)

  t.is(typeof subject.extra, 'undefined')
})

test('getRelationships ignores missing attributes in data', t => {
  var widget = {}
  var subject = getRelationships(SPEC, 'Widget', widget)

  t.deepEqual(subject, {})
})

test('getRelationships preserves existing relationships', t => {
  var widget = {
    relationships: {
      company: {
        type: 'companies',
        id: '42',
      },
    },
  }
  var subject = getRelationships(SPEC, 'Widget', widget)

  t.deepEqual(subject, widget.relationships)
})

test('getRelationships prefers existing relationships', t => {
  var widget = {
    company: {
      id: 23,
    },
    relationships: {
      company: {
        type: 'companies',
        id: '42',
      },
    },
  }
  var subject = getRelationships(SPEC, 'Widget', widget)

  t.deepEqual(subject, widget.relationships)
})

test('getRelationships returns null if data is null', t => {
  var subject = getRelationships(SPEC, 'Widget', null)

  t.is(subject, null)
})

test('getRelationships throws if spec is null', t => {
  t.throws(function () {
    getRelationships(null, 'Widget', {})
  })
})

test('getRelationships throws if spec is not an object', t => {
  t.throws(function () {
    getRelationships(42, 'Widget', {})
  })
})

test('getRelationships throws if spec has no definitions', t => {
  t.throws(function () {
    getRelationships({}, 'Widget', {})
  })
})

test('getRelationships throws if name is not defined', t => {
  t.throws(function () {
    getRelationships(SPEC, 'DoesNotExist', {})
  })
})

test('getRelationships throws if identifier path is bad', t => {
  var widget = {
    company: {
      id: 42,
    },
  }

  t.throws(function () {
    getRelationships(SPEC, 'BadPath', widget)
  })
})

test('getRelationships throws if identifier name is bad', t => {
  var widget = {
    company: {
      id: 42,
    },
  }

  t.throws(function () {
    getRelationships(SPEC, 'BadName', widget)
  })
})

test('getRelationships throws if identifier reference is missing', t => {
  var widget = {
    company: {
      id: 42,
    },
  }

  t.throws(function () {
    getRelationships(SPEC, 'NoName', widget)
  })
})
