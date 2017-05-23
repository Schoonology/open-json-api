var extend = require('util')._extend

module.exports = function defineResource(spec, name, options) {
  if (!name) {
    throw new TypeError('Name is required.')
  }

  if (!options || !options.type) {
    throw new TypeError('Type option is required.')
  }

  spec = extend({
    definitions: {}
  }, spec)

  spec.definitions = extend({}, spec.definitions)

  spec.definitions[name + 'Identifier'] = {
    type: 'object',
    additionalProperties: false,
    properties: {
      type: {
        type: 'string',
        pattern: String(options.type),
      },
      id: {
        type: 'string',
      },
    },
  }

  spec.definitions[name] = {
    type: 'object',
    additionalProperties: false,
    properties: {
      type: {
        type: 'string',
        pattern: String(options.type),
      },
      id: {
        type: 'string',
      },
      attributes: {
        type: 'object',
        additionalProperties: false,
        properties: options.attributes || {},
      },
      relationships: {
        type: 'object',
        additionalProperties: false,
        properties: {},
      },
    },
  }

  Object.keys(options.relationships || {})
    .forEach(function (key) {
      spec.definitions[name].properties.relationships.properties[key] = {
        $ref: '#/definitions/' + options.relationships[key] + 'Identifier',
      }
    })

  return spec
}
