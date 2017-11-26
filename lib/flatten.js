var extend = require('util')._extend

module.exports = function flatten(data) {
  var flattened = {}

  if (!data) {
    return null
  }

  Object.keys(data)
    .filter(function (key) {
      return key !== 'type' && key !== 'attributes' && key !== 'relationships' && key !== 'links'
    })
    .forEach(function (key) {
      flattened[key] = data[key]
    })

  Object.keys(data.attributes || {})
    .forEach(function (key) {
      flattened[key] = data.attributes[key]
    })

  Object.keys(data.relationships || {})
    .forEach(function (key) {
      if (!data.relationships[key].id) {
        return
      }

      flattened[key] = {
        id: data.relationships[key].id
      }
    })

  Object.keys(data.links || {})
    .forEach(function (key) {
      flattened[key] = data.links[key]
    })

  return flattened
}
