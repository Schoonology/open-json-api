module.exports = function getType(spec, name) {
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

  if (!def.properties || !def.properties.type) {
    return null
  }

  return def.properties.type.pattern ||
    (def.properties.type.enum && def.properties.type.enum[0]) ||
    null
}
