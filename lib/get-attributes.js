var getResourceDefinition = require('./get-resource-definition')
var CASTS_FOR_TYPE = {
  string: String,
  number: parseFloat,
  integer: parseInt,
  boolean: Boolean,
  array: function noop(_) { return _ },
  file: function noop(_) { return _ },
}

module.exports = function getAttributes(spec, name, data) {
  var def = getResourceDefinition(spec, name)
  var keys = Object.keys(def.properties.attributes)

  if (!data) {
    return null
  }

  return keys
    .filter(function (key) {
      return typeof data[key] !== 'undefined'
    })
    .reduce(function (attrs, key) {
      attrs[key] = CASTS_FOR_TYPE[def.properties.attributes[key].type](data[key])
      return attrs
    }, {})
}
