var extend = require('util')._extend

module.exports = function flatten(data) {
  var flattened = {}

  if (!data) {
    return null
  }

  if (data.id) {
    flattened.id = data.id
  }

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

  return flattened
}