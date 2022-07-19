var getResourceDefinition = require('./get-resource-definition')
var normalizeAttributes = require('./normalize-attributes')

module.exports = function getAttributes (spec, name, data) {
  var def = getResourceDefinition(spec, name)
  var props = def.properties.attributes.properties

  if (data?.attributes) {
    data = data.attributes
  }

  return normalizeAttributes(props, data)
}
