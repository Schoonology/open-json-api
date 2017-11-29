var getResourceDefinition = require('./get-resource-definition')
var getType = require('./get-type')
var NAME_FROM_URL = /^#\/definitions\/([a-zA-Z0-9]+Identifier)$/

function getResourceNameFromDefinitionURL (url) {
  var match = NAME_FROM_URL.exec(url)

  if (!match) {
    throw new Error('Bad format for Identifier reference: ' + url)
  }

  return match[1]
}

module.exports = function getRelationships (spec, name, data) {
  var def = getResourceDefinition(spec, name)
  var props = def.properties.relationships.properties
  var keys = Object.keys(props)

  if (!data) {
    return null
  }

  if (data.relationships) {
    data = data.relationships
  }

  return keys
    .filter(function (key) {
      return typeof data[key] !== 'undefined'
    })
    .reduce(function (attrs, key) {
      var relationship = props[key].properties.data
      var type

      if (relationship.$ref) {
        type = getType(spec, getResourceNameFromDefinitionURL(relationship.$ref))
      } else {
        type = getType(relationship)
      }

      attrs[key] = {
        type: type,
        id: String(data[key].id)
      }

      return attrs
    }, {})
}
