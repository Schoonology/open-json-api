var getResourceDefinition = require('./get-resource-definition')

module.exports = function getLinks(spec, name, data) {
  var def = getResourceDefinition(spec, name)

  if (!def.properties.links) {
    return null
  }

  var props = def.properties.links.properties
  var keys = Object.keys(props)

  if (!data) {
    return null
  }

  if (data.links) {
    data = data.links
  }

  return keys
    .filter(function (key) {
      return data[key] != null
    })
    .reduce(function (attrs, key) {
      attrs[key] = String(data[key])
      return attrs
    }, {})
}
