var getResourceDefinition = require('./get-resource-definition')

module.exports = function getType(spec, name) {
  var def = getResourceDefinition(spec, name)

  if (!def.properties.type) {
    return null
  }

  return def.properties.type.pattern ||
    (def.properties.type.enum && def.properties.type.enum[0]) ||
    null
}
