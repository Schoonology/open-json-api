var getAttributes = require('./get-attributes')
var getRelationships = require('./get-relationships')
var getType = require('./get-type')

module.exports = function serialize(spec, name, data) {
  return {
    data: {
      id: String(data.id),
      type: getType(spec, name),
      attributes: getAttributes(spec, name, data),
      relationships: getRelationships(spec, name, data),
    }
  }
}
