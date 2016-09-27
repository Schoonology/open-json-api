var extend = require('util')._extend

module.exports = function getResourceDefinition(spec, name) {
  if (!spec || typeof spec !== 'object') {
    throw new TypeError('Spec is required.')
  }

  if (!spec.definitions) {
    throw new TypeError('Spec has no definitions.')
  }

  var def = spec.definitions[name]

  if (!def) {
    throw new TypeError('Spec has no definition for ' + name + '.')
  }

  def = extend({ properties: {} }, def)
  def.properties = extend({ attributes: {}, relationships: {} }, def.properties)
  def.properties.attributes = extend({ properties: {} }, def.properties.attributes)
  def.properties.relationships = extend({ properties: {} }, def.properties.relationships)

  return def
}
