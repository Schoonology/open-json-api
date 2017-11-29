module.exports = function defineResource (spec, name, options) {
  if (!name) {
    throw new TypeError('Name is required.')
  }

  if (!options || !options.type) {
    throw new TypeError('Type option is required.')
  }

  spec = Object.assign({
    definitions: {}
  }, spec)

  spec.definitions = Object.assign({}, spec.definitions)

  spec.definitions[name + 'Identifier'] = {
    type: 'object',
    additionalProperties: false,
    properties: {
      type: {
        type: 'string',
        pattern: String(options.type)
      },
      id: {
        type: 'string'
      }
    }
  }

  spec.definitions[name] = {
    type: 'object',
    additionalProperties: false,
    properties: {
      type: {
        type: 'string',
        pattern: String(options.type)
      },
      id: {
        type: 'string'
      },
      attributes: {
        type: 'object',
        additionalProperties: false,
        properties: options.attributes || {}
      },
      relationships: {
        type: 'object',
        additionalProperties: false,
        properties: {}
      }
    }
  }

  Object.keys(options.relationships || {})
    .forEach(function (key) {
      spec.definitions[name].properties.relationships.properties[key] = {
        $ref: '#/definitions/' + options.relationships[key] + 'Identifier'
      }
    })

  if (Array.isArray(options.links) && options.links.length) {
    spec.definitions[name].properties.links = {
      type: 'object',
      properties: {}
    }

    options.links.forEach(function (link) {
      spec.definitions[name].properties.links.properties[link] = {
        type: 'string',
        format: 'url'
      }
    })
  }

  return spec
}
