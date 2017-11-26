var test = require('ava')
var oja = require('../../lib/open-json-api')

test('oja exports normalize', t => {
  t.is(typeof oja.normalize, 'function')
})

test('oja exports flatten', t => {
  t.is(typeof oja.flatten, 'function')
})

test('oja exports defineResource', t => {
  t.is(typeof oja.defineResource, 'function')
})
