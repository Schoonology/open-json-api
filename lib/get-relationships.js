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

function fillRelationship (spec, specForData, existingData) {
  if (specForData.type === 'array') {
    return existingData.map(function (item) {
      return fillRelationship(spec, specForData.items, item)
    })
  }

  var type

  if (specForData.$ref) {
    type = getType(spec, getResourceNameFromDefinitionURL(specForData.$ref))
  } else {
    type = getType(specForData)
  }

  return {
    type: type,
    id: String(existingData.id)
  }
}

function migrateRelationshipIds(data, keys) {
  return keys.reduce((obj, key) => ({
    [key]: obj[key + 'Id'] && { id: obj[key + 'Id'] },
    ...obj,
  }), data)
}

module.exports = function getRelationships (spec, name, data) {
  var def = getResourceDefinition(spec, name)
  var props = def.properties.relationships.properties
  var keys = Object.keys(props)

  if (!data) {
    return null
  }

  // Migrate keyId to key.id as necessary
  data = migrateRelationshipIds(data, keys)

  return keys
    .filter(function (key) {
      return typeof data[key] !== 'undefined'
    })
    .reduce(function (attrs, key) {
      attrs[key] = attrs[key] || {
        data: fillRelationship(
          spec,
          props[key].properties.data,
          data[key]
        )
      }

      return attrs
    }, data.relationships || {})
}
