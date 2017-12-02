var test = require('ava')
var oja = require('../../lib/open-json-api')

test('oja exports', t => {
  t.deepEqual(Object.keys(oja).sort(), [
    'defineCreateRoute',
    'defineGetRoute',
    'defineResource',
    'defineSearchRoute',
    'defineUpdateRoute',
    'flatten',
    'initializeSpec',
    'normalize'
  ])
})
