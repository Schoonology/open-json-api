var assert = require('assert')
var oja = require('../../lib/open-json-api')

module.exports = {
  'oja exports normalize': function () {
    assert.equal(typeof oja.normalize, 'function')
  },
  'oja exports flatten': function () {
    assert.equal(typeof oja.flatten, 'function')
  },
}
