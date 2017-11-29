var getResourceDefinition = require('./get-resource-definition')

module.exports = function getType (spec, name) {
  var def

  if (arguments.length === 1) {
    def = spec
  } else {
    def = getResourceDefinition(spec, name)
  }

  if (typeof def !== 'object' || typeof def.properties !== 'object') {
    throw new TypeError('Definition is not valid.')
  }

  if (!def.properties.type) {
    return null
  }

  return def.properties.type.pattern ||
    (def.properties.type.enum && def.properties.type.enum[0]) ||
    null
}
