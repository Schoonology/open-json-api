module.exports = function getResourceDefinition (spec, name) {
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

  def = Object.assign({ properties: {} }, def)
  def.properties = Object.assign({ attributes: {}, relationships: {} }, def.properties)
  def.properties.attributes = Object.assign({ properties: {} }, def.properties.attributes)
  def.properties.relationships = Object.assign({ properties: {} }, def.properties.relationships)

  return def
}
