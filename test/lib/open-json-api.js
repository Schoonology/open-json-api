var assert = require('assert')
var oja = require('../../lib/open-json-api')

module.exports = {
  'oja exports serialize': function () {
    assert.equal(typeof oja.serialize, 'function')
  },
}
